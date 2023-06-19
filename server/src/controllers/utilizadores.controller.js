const { Utilizador, TipoUtilizador } = require("../database/index.js");
const { requirePermission, requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");
const { randomString } = require("../utils/randomString.js");
const { sendEmail } = require("../services/email.js");
const { stripIndents } = require("common-tags");
const bcrypt = require("bcrypt");
const { z } = require("zod");

const PASSWORD_CHANGE_EXPIRATION_TIME = 15 * 60 * 1_000; // 15m

/** @type {import("../database/index.js").Controller} */
module.exports = {
	read: [
		requirePermission(TipoUtilizadorEnum.Administrador),

		async (_req, res) => {
			res.json(
				await Utilizador.findAll({
					attributes: ["id", "name", "email", "lastLoginDate", "disabled", "disabledAt", "disabledBy"],
					include: [
						{
							model: TipoUtilizador,
							as: "tipoUtilizador",
							attributes: ["name", "id"],
						},
					],
					order: [["id", "ASC"]],
				}),
			);
		},
	],

	update: [
		requirePermission(TipoUtilizadorEnum.Administrador),
		validate(
			z.object({
				idTipoUser: z.number().int().nonnegative().min(1).max(6),
			}),
		),

		async (req, res) => {
			const { idTipoUser } = req.body;
			const { id } = req.params;

			const utilizador = await Utilizador.findByPk(id);
			if (!utilizador) {
				res.status(404).json({ message: "Utilizador não encontrado" });
				return;
			}

			res.json(await utilizador.update({ idTipoUser: Number.parseInt(idTipoUser, 10) }));
		},
	],

	disableAccount: [
		requireLogin(),
		validate(
			z.object({
				disabled: z.boolean(),
			}),
		),

		async (req, res) => {
			const { disabled } = req.body;
			const { id } = req.params;

			const utilizador = await Utilizador.findByPk(id);
			if (!utilizador) {
				res.status(404).json({ message: "Utilizador não encontrado" });
				return;
			}

			const opts = {
				disabled,
				disabledAt: new Date(),
				disabledBy: undefined,
			};

			if (req.user.tipoUtilizador.id === TipoUtilizadorEnum.Administrador && id !== req.user.id) {
				opts.disabledBy = req.user.id;
			}

			await utilizador.update(opts);

			res.json({ message: disabled ? "Conta desativada com sucesso" : "Conta ativada com sucesso" });
		},
	],

	esqueceuPasswordRequest: [
		validate(
			z.object({
				email: z.string().email(),
			}),
		),

		async (req, res) => {
			const { email } = req.body;

			const utilizador = await Utilizador.findOne({ where: { email } });
			if (!utilizador) {
				res.status(404).json({ message: "Utilizador não encontrado" });
				return;
			}

			const newPasswordCode = randomString(32);
			const newPasswordDate = new Date();

			try {
				await sendEmail(
					email,
					"Recuperação de password",
					stripIndents`
						<h2>Olá ${utilizador.name},</h2>
						<p>Visite o seguinte link para redefinir a sua password: <a href="\`${process.env.WEB_URL}/mudar-password?code=${newPasswordCode}&id=${utilizador.id}\`">Recuperar password</a></p>
						<br>
						<p>Se não foi você que pediu para redefinir a sua password, ignore este email.</p>
					`,
				);
			} catch (error) {
				console.error(error);

				res.status(500).json({ message: "Ocorreu um erro ao enviar o email" });
				return;
			}

			await utilizador.update({ newPasswordCode, newPasswordDate });

			res.json({ message: "Código enviado com sucesso" });
		},
	],

	esqueceuPasswordUpdate: [
		validate(
			z.object({
				code: z.string(),
				password: z.string(),
			}),
		),

		async (req, res) => {
			const { id } = req.params;
			const { code, password } = req.body;

			const utilizador = await Utilizador.findByPk(id, { attributes: ["id", "newPasswordCode", "newPasswordDate"] });
			if (!utilizador) {
				res.status(404).json({ message: "Utilizador não encontrado" });
				return;
			}

			if (utilizador.newPasswordCode !== code) {
				res.status(403).json({ message: "Código inválido" });
				return;
			}

			if (Date.now() - utilizador.newPasswordDate.getTime() > PASSWORD_CHANGE_EXPIRATION_TIME) {
				res.status(403).json({ message: "Código expirado" });
				return;
			}

			const hashedPassword = await bcrypt.hash(password, 10);

			await utilizador.update({ hashedPassword, newPasswordCode: null, newPasswordDate: null });

			res.json({ message: "Código atualizado com sucesso" });
		},
	],
};
