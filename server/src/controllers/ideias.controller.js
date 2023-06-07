const { Ideia, Utilizador } = require("../database/index.js");
const { requirePermission, requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");
const { z } = require("zod");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requireLogin(),
		validate(
			z.object({
				content: z.string().min(1).max(1000),
				categoria: z.enum(["Geral", "Estabelecimento", "Investimentos", "Negócios"]),
			}),
		),

		async (req, res) => {
			const { content, categoria } = req.body;

			const ideia = await Ideia.create({
				idCriador: req.user.id,
				content,
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
							attributes: ["id", "name"],
						},
						{
							model: Utilizador,
							as: "validador",
							source: "idValidador",
							attributes: ["id", "name"],
						},
					],
					order: [["id", "ASC"]],
				}),
			);
		},
	],

	update: [
		requirePermission(TipoUtilizadorEnum.GestorIdeias),
		validate(
			z.object({
				ideiaValidada: z.boolean(),
			}),
		),

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

			res.json(
				await ideia.update({
					ideiaValidada,
					idValidador: ideiaValidada ? req.user.id : null,
				}),
			);
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

			res.status(200).json({ message: "Ideia eliminada" });
		},
	],
};
