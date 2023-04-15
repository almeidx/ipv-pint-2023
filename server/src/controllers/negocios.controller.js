const { Negocio } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create(req, res) {
		const { idAreaNegocio, idCliente, idCentroTrabalho, description, title, status } = req.body;

		try {
			const negocio = Negocio.create({
				idAreaNegocio,
				idCliente,
				idCentroTrabalho,
				description,
				title,
				status,
			});

			res.json(negocio);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	async read(req, res) {
		res.json(await Negocio.findAll());
	},

	update() {},

	delete() {},
};
