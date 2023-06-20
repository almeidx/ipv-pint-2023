const { Contacto } = require("../database/index.js");
const { requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const { z } = require("zod");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requireLogin(),
		validate(
			z
				.object({
					value: z.string(),
					type: z.number().min(0).max(1),
				})
				.strict(),
		),

		async (req, res) => {
			const { value, type } = req.body;
			const { id } = req.params;

			const contacto = await Contacto.create({
				idCliente: id,
				value,
				type,
			});

			res.json(contacto);
		},
	],

	read: [
		requireLogin(),

		async (req, res) => {
			const { id } = req.params;

			res.json(
				await Contacto.findAll({
					where: {
						idCliente: id,
					},
					order: [["type", "ASC"]],
				}),
			);
		},
	],
};
