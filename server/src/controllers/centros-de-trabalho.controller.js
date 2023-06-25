const { z } = require("zod");
const { CentroTrabalho, Negocio } = require("../database/index.js");
const { requireColaborador, requirePermission } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requirePermission(TipoUtilizadorEnum.Administrador),
		validate(
			z
				.object({
					name: z.string().min(3).max(100),
					location: z.string().min(3).max(100),
					postalCode: z.string().regex(/^\d{4}-\d{3}?$/),
					address: z.string().min(3).max(100),
				})
				.strict(),
		),

		async (req, res) => {
			const { name, location, postalCode, address } = req.body;

			const centroTrabalho = await CentroTrabalho.create({
				name,
				location,
				postalCode,
				address,
			});

			res.json(centroTrabalho);
		},
	],

	read: [
		requireColaborador(),

		async (_req, res) => {
			res.json(
				await CentroTrabalho.findAll({
					order: [["name", "ASC"]],
				}),
			);
		},
	],

	destroy: [
		requirePermission(TipoUtilizadorEnum.Administrador),

		async (req, res) => {
			const { id } = req.params;

			const centroTrabalho = await CentroTrabalho.findByPk(id, {
				include: [
					{
						model: Negocio,
						as: "negocios",
						attributes: ["id"],
					},
				],
			});

			if (!centroTrabalho) {
				res.status(404).json({ message: "Centro de trabalho não encontrado" });
				return;
			}

			if (centroTrabalho.negocios.length > 0) {
				res.status(403).json({
					message: "Não é possível apagar um centro de trabalho com negócios associados",
				});
				return;
			}

			await centroTrabalho.destroy();

			res.json({ message: "Centro de trabalho apagado" });
		},
	],
};
