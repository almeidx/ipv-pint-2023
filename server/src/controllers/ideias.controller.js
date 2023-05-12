const { body } = require("express-validator");
const { Ideia, Utilizador } = require("../database/index.js");
const { requirePermission, requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requireLogin(),
		async (req, res) => {
			const { conteudo, categoria } = req.body;

			const ideia = await Ideia.create({
				idCriador: req.user.id,
				conteudo,
				categoria,
			});

			res.json(ideia);
		},
	],

	read: [
		requirePermission(TipoUtilizadorEnum.GestorIdeias),
		async (_req, res) => {
			res.json(
				await Ideia.findAll({
					include: [
						{
							model: Utilizador,
							as: "utilizador",
							source: "idCriador",
						},
						{
							model: Utilizador,
							as: "validador",
							source: "idValidador",
						},
					],
				}),
			);
		},
	],

	update: [
		requirePermission(TipoUtilizadorEnum.GestorIdeias),
		validate(body("ideiaValidada", "`ideiaValidada` tem que ser do tipo boolean").isBoolean()),

		async (req, res) => {
			const { ideiaValidada } = req.body;
			const { id } = req.params;

			const ideia = await Ideia.findByPk(id);
			if (!ideia) {
				res.status(404).json({ message: "Ideia não encontrada" });
				return;
			}

			await ideia.update({
				ideiaValidada,
				idValidador: ideiaValidada ? req.user.id : null,
			});

			res.send();
		},
	],

	destroy: [
		requirePermission(TipoUtilizadorEnum.GestorIdeias),
		async (req, res) => {
			const { id } = req.params;

			const ideia = await Ideia.findByPk(id);
			if (!ideia) {
				res.status(404).json({ message: "Ideia não encontrada" });
				return;
			}

			await ideia.destroy();

			res.status(204).json({ message: "Ideia eliminada" });
		},
	],
};
