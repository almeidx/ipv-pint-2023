const { param } = require("express-validator");
const { Contacto } = require("../database/index.js");
const { requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requireLogin(),
		validate(param("id", "`id` tem que ser do tipo inteiro").isInt()),

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
		validate(param("id", "`id` tem que ser do tipo inteiro").isInt()),

		async (req, res) => {
			const { id } = req.params;

			res.json(
				await Contacto.findAll({
					where: {
						idCliente: id,
					},
				}),
			);
		},
	],
};
