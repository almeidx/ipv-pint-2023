const { z } = require("zod");
const { TipoProjeto, Negocio } = require("../database/index.js");
const { validate } = require("../middleware/validation.js");
const { requirePermission } = require("../middleware/authentication.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requirePermission(TipoUtilizadorEnum.GestorNegocios),
		validate(z.object({ name: z.string().min(3).max(64) }).strict()),

		async (req, res) => {
			const { name } = req.body;

			const tipoProjeto = await TipoProjeto.create({ name });

			res.json(tipoProjeto);
		},
	],

	read: [
		async (_req, res) => {
			res.json(
				await TipoProjeto.findAll({
					order: [["name", "ASC"]],
				}),
			);
		},
	],

	destroy: [
		requirePermission(TipoUtilizadorEnum.GestorNegocios),

		async (req, res) => {
			const { id } = req.params;

			const tipoProjeto = await TipoProjeto.findByPk(id, {
				include: [
					{
						model: Negocio,
						as: "negocios",
						attributes: ["id"],
					},
				],
			});

			if (!tipoProjeto) {
				res.status(404).json({ message: "Tipo de projeto não encontrado" });
				return;
			}

			if (tipoProjeto.negocios.length > 0) {
				res.status(403).json({
					message: "Não é possível apagar um tipo de projeto com negócios associados",
				});
				return;
			}

			await tipoProjeto.destroy();

			res.json({ message: "Tipo de projeto apagado" });
		},
	],
};
