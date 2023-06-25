const bcrypt = require("bcrypt");
const passport = require("passport");
const { Utilizador } = require("../database/index.js");
const { requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const { randomNumberString } = require("../utils/randomNumberString.js");
const { sendEmail } = require("../services/email.js");
const { stripIndents } = require("common-tags");
const { z } = require("zod");
const { isSoftinsaEmail } = require("../utils/isSoftinsaEmail.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");
const { PASSWORD_RESET_TOKEN, MOBILE_GOOGLE_AUTH_TOKEN } = require("../utils/constants.js");

/**
 * @type {Record<string, ((req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void> | void)|[...(import("express").RequestHandler), (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void> | void]>}
 */
module.exports = {
	auth: [passport.authenticate("local")],

	email(req, res, next) {
		passport.authenticate("local", (err, user, info) => {
			if (err) {
				if (typeof err.message === "string") {
					const registrationType = /Conta (facebook|google)/i.exec(err.message);

					if (registrationType) {
						res.status(401).json({
							message: `A sua conta está registada através de ${registrationType[1]}`,
							provider: registrationType[1],
						});
						return;
					}
				}

				return next(err);
			}

			if (!user) {
				res.status(401).json({ message: "Credenciais inválidas" });
				return;
			}

			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}

				res.json({ user: req.user });
			});
		})(req, res, next);
	},

	user: [
		requireLogin(),
		(req, res) => {
			res.json({ cookie: req.cookies["connect.sid"], user: req.user });
		},
	],

	logout(req, res) {
		const { r } = req.query;

		const redirectUrl = r === "login" ? `${process.env.WEB_URL}/login` : process.env.WEB_URL;

		if (!req.user) {
			res.redirect(redirectUrl);
			return;
		}

		req.logout((err) => {
			if (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível terminar a sessão" });
				return;
			}

			res.redirect(redirectUrl);
		});
	},

	register: [
		validate(
			z
				.object({
					name: z.string().min(1).max(100),
					email: z.string().email(),
					password: z
						.string()
						.min(12, "Password deve ter pelo menos 12 caracteres")
						.max(128, "Password deve ter no máximo 128 caracteres")
						.regex(/[a-z]/, "Password deve ter pelo menos uma letra minúscula")
						.regex(/[A-Z]/, "Password deve ter pelo menos uma letra maiúscula")
						.regex(/[0-9]/, "Password deve ter pelo menos um número")
						.regex(/[^a-z0-9]/i, "Password deve ter pelo menos um caracter especial"),
				})
				.strict(),
		),

		async (req, res, next) => {
			const { name, email, password } = req.body;

			const existingUser = await Utilizador.findOne({ where: { email } });
			if (existingUser) {
				res.status(409).json({ message: "Email já está a ser usado" });
				return;
			}

			const hashedPassword = await bcrypt.hash(password, 10);
			const confirmCode = randomNumberString(12);

			const user = await Utilizador.create({
				name,
				email,
				hashedPassword,
				confirmCode,
				confirmDateStart: new Date(),
				idTipoUser: isSoftinsaEmail(email) ? TipoUtilizadorEnum.Colaborador : TipoUtilizadorEnum.Utilizador,
			});

			await sendEmail(
				email,
				"Confirmação de conta",
				stripIndents`
					<h2>Olá ${name},</h2>
					<p>Para confirmar a sua conta, introduza o seguinte código na página:</p>
					<b>${confirmCode}</b>
					<br>
					<p>Caso não tenha guardado a página, redirecione-se aqui: <a href="${process.env.WEB_URL}/verificar-conta">Página de verificação</a></p>
					<p>Se não foi você que criou esta conta, ignore este email.</p>
					<br>
					<p>Obrigado</p>
				`,
			);

			res.json({ message: "Conta criada com sucesso", userId: user.id });
		},
	],

	validarConta: [
		validate(
			z
				.object({
					confirmCode: z.string().min(12).max(100),
					userId: z.number(),
				})
				.strict(),
		),

		async (req, res, next) => {
			const { confirmCode, userId } = req.body;

			const utilizador = await Utilizador.findOne({ where: { id: userId } });
			if (!utilizador) {
				res.status(404).json({ message: "Utilizador não encontrado" });
				return;
			}

			if (utilizador.confirmCode !== confirmCode) {
				res.status(401).json({ message: "Código de confirmação inválido" });
				return;
			}

			await utilizador.update({ confirmCode: null, confirmDateStart: null, hasConfirmed: true });

			req.body = { email: utilizador.email, password: PASSWORD_RESET_TOKEN };

			passport.authenticate("local", function (err, user) {
				if (err) {
					return next(err);
				}

				if (!user) {
					return res.redirect("/auth/user");
				}

				req.logIn(user, function (err) {
					if (err) {
						return next(err);
					}

					return res.json({ user: req.user });
				});
			})(req, res, next);
		},
	],

	retryValidar: [
		validate(
			z
				.object({
					userId: z.number(),
				})
				.strict(),
		),

		async (req, res) => {
			const { userId } = req.body;

			const utilizador = await Utilizador.findOne({ where: { id: userId } });
			if (!utilizador) {
				res.status(404).json({ message: "Utilizador não encontrado" });
				return;
			}

			if (utilizador.confirmRetries > 1 && new Date(utilizador.confirmDateStart).getTime() + 60_000 < Date.now()) {
				res.status(401).json({ message: "Aguarde 1 minuto para voltar a pedir um código de confirmação" });
				return;
			}

			const confirmCode = randomNumberString(12);

			await utilizador.update({
				confirmCode,
				confirmDateStart: new Date(),
				confirmRetries: utilizador.confirmRetries + 1,
			});

			await sendEmail(
				utilizador.email,
				"Confirmação de conta",
				stripIndents`
					<h2>Olá ${utilizador.name},</h2>
					<p>Para confirmar a sua conta, introduza o seguinte código na página:</p>
					<b>${confirmCode}</b>
					<br>
					<p>Caso não tenha guardado a página, redirecione-se aqui: <a href="${process.env.WEB_URL}/verificar-conta">Página de verificação</a></p>
					<p>Se não foi você que criou esta conta, ignore este email.</p>
					<br>
					<p>Obrigado</p>
				`,
			);

			res.json({ message: "Email enviado com sucesso" });
		},
	],

	google: [passport.authenticate("google", { scope: ["profile", "email"] })],
	googleCallback: [
		passport.authenticate("google", { failureRedirect: process.env.WEB_URL + "/signup?fail" }),
		(_req, res) => {
			res.redirect(process.env.WEB_URL);
		},
	],
	googleCallbackMobile: [
		validate(
			z.object({
				id: z.string(),
				email: z.string().email(),
				name: z.string(),
			}),
		),

		async (req, res) => {
			const { id, email, name } = req.body;

			let account = await Utilizador.findOne({
				where: { email },
			});

			if (account && account.registrationType !== "google") {
				res.status(401).json({
					message: `A sua conta está registada através de ${account.registrationType}.`,
					provider: account.registrationType,
				});
				return;
			}

			account ??= await Utilizador.create({
				name,
				email,
				socialUserId: id,
				registrationType: "google",
				hashedPassword: "",
				idTipoUser: isSoftinsaEmail(email) ? TipoUtilizadorEnum.Colaborador : TipoUtilizadorEnum.Utilizador,
			});

			req.body = { email, password: MOBILE_GOOGLE_AUTH_TOKEN };

			passport.authenticate("local", function (err, user) {
				if (err) {
					return next(err);
				}

				if (!user) {
					return res.redirect("/auth/user");
				}

				req.logIn(user, function (err) {
					if (err) {
						return next(err);
					}

					return res.json({ user: req.user });
				});
			});
		},
	],

	facebook: [passport.authenticate("facebook", { scope: ["email"] })],
	facebookCallback: [
		passport.authenticate("facebook", { failureRedirect: process.env.WEB_URL + "/signup?fail" }),
		(_req, res) => {
			res.redirect(process.env.WEB_URL);
		},
	],
};
