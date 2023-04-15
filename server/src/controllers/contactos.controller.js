const { Contacto } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async create(req, res) {
		const { value, type } = req.body;

		try {
			const contacto = await Contacto.create({
				value,
				type,
			});

			res.json(contacto);
		} catch (error) {
			console.log(error);

			res.status(500).json({
				message: "Internal server error",
				error,
			});
		}
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

	delete() {},
};
