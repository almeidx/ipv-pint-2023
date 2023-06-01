const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const passport = require("passport");
const { Utilizador } = require("../database/index.js");
const { requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const { randomNumberString } = require("../utils/randomNumberString.js");
const { sendEmail } = require("../services/email.js");
const { stripIndents } = require("common-tags");

/**
 * @type {Record<string, ((req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void> | void)|[...(import("express").RequestHandler), (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void> | void]>}
 */
module.exports = {
	auth: [passport.authenticate("local")],

	email(req, res, next) {
		passport.authenticate("local", (err, user, info) => {
			if (err) {
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
		if (!req.user) {
			res.redirect(process.env.WEB_URL);
			return;
		}

		req.logout((err) => {
			if (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível iniciar a sessão" });
				return;
			}

			res.redirect(process.env.WEB_URL);
		});
	},

	register: [
		validate(
			body("name", "`name` tem que ser do tipo string ").isString().isLength({ min: 1, max: 100 }),
			body("email", "`email` tem que ser um email").isEmail(),
			body("password", "`password` tem que ser do tipo string e ter entre 12 e 100 caracteres")
				.isString()
				.isLength({ min: 1, max: 100 }),
		),

		async (req, res, next) => {
			const { name, email, password } = req.body;

			const hashedPassword = await bcrypt.hash(password, 10);
			const confirmCode = randomNumberString(12);

			const user = await Utilizador.create({ name, email, hashedPassword, confirmCode, confirmDateStart: new Date() });

			await sendEmail(
				email,
				"Confirmação de conta",
				stripIndents`
					<h2>Olá ${name},</h2>
					<br>
					<p>Para confirmar a sua conta, introduza o seguinte código na página:</p>
					<br>
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
			body("confirmCode", "`confirmCode` tem que ser do tipo string e ter 12 caracteres")
				.isString()
				.isLength({ min: 12, max: 100 }),
			body("userId", "`userId` tem que ser do tipo number").isNumeric(),
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

			req.body = { email: utilizador.email, password: process.env.PASSWORD_BYPASS_TOKEN };

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

	google: [passport.authenticate("google", { scope: ["profile", "email"] })],
	googleCallback: [
		passport.authenticate("google", { failureRedirect: process.env.WEB_URL + "/signup?fail" }),
		(_req, res) => {
			res.redirect(process.env.WEB_URL);
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
