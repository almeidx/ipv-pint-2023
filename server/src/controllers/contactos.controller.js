const { Contacto } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async create(req, res) {
		const { value, type } = req.body;

		const contacto = await Contacto.create({
			value,
			type,
		});

		res.json(contacto);
	},

	async read(req, res) {
		const { idCliente } = req.params;

		if (idCliente === undefined) {
			return res.status(400).json({ message: "Missing idCliente" });
		}

		res.json(
			await Contacto.findAll({
				where: {
					idCliente,
				},
			}),
		);
	},

	update() {},

	destroy() {},
};
