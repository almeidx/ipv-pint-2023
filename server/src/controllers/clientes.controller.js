const { Cliente } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async create(req, res) {
		const { id, name } = req.body;

		try {
			const cliente = await Cliente.create({
				id,
				name,
			});

			res.json(cliente);
		} catch (error) {
			console.log(error);

			res.status(500).json({
				message: "Internal server error",
				error,
			});
		}
	},

	async read(req, res) {
		res.json(await Cliente.findAll());
	},

	update() {},

	delete() {},
};
