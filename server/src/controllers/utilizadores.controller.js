const { body, param } = require("express-validator");
const { Utilizador, TipoUtilizador } = require("../database/index.js");
const { requirePermission, requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

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
			param("id", "`id` tem que ser do tipo int").isInt(),
			body("idTipoUser", "`idTipoUser` tem que estar entre [1, 6]").isInt({ min: 1, max: 6 }),
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
			param("id", "`id` tem que ser do tipo inteiro").isInt(),
			body("active", "`active` tem que ser do tipo boolean").isBoolean(),
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

			if (req.user.tipoUtilizador.id === TipoUtilizadorEnum.Administrador) {
				opts.disabledBy = req.user.id;
			}

			await utilizador.update(opts);

			res.json({ message: disabled ? "Conta desativada com sucesso" : "Conta ativada com sucesso" });
		},
	],
};
