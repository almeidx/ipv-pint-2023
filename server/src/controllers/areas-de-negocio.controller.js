const { z } = require("zod");
const { AreaNegocio, Negocio } = require("../database/index.js");
const { validate } = require("../middleware/validation.js");
const { requirePermission } = require("../middleware/authentication.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requirePermission(TipoUtilizadorEnum.GestorNegocios),
		validate(
			z.object({
				name: z.string().min(3).max(64),
			}),
		),

		async (req, res) => {
			const { name } = req.body;

			const areaNegocio = await AreaNegocio.create({
				name,
			});

			res.json(areaNegocio);
		},
	],

	read: [
		async (_req, res) => {
			res.json(
				await AreaNegocio.findAll({
					order: [["name", "ASC"]],
				}),
			);
		},
	],

	destroy: [
		requirePermission(TipoUtilizadorEnum.GestorConteudos),

		async (req, res) => {
			const { id } = req.params;

			const areaNegocio = await AreaNegocio.findByPk(id, {
				include: [
					{
						model: Negocio,
						as: "negocios",
						attributes: ["id"],
					},
				],
			});

			if (!areaNegocio) {
				res.status(404).json({ error: "Área de negócio não encontrada" });
				return;
			}

			if (areaNegocio.negocios.length > 0) {
				res.status(403).json({
					message: "Não é possível apagar uma área de negócio com negócios associados",
				});
				return;
			}

			await areaNegocio.destroy();

			res.json({ message: "Área de negócio apagada" });
		},
	],
};
