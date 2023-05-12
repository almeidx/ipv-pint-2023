const { Contacto } = require("../database/index.js");
const { requireLogin } = require("../middleware/authentication.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requireLogin(),
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
				}),
			);
		},
	],
};
