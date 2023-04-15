const { Ideia } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async create(req, res) {
		const { conteudo, categoria } = req.body;

		try {
			const ideia = await Ideia.create({
				conteudo,
				categoria,
				dataCriacao: new Date(),
			});

			return res.json(ideia);
		} catch (error) {
			console.log(error);

			res.status(500).json({
				message: "Internal server error",
				error,
			});
		}
	},

	async read(req, res) {
		res.json(await Vaga.findAll());
	},

	update() {},

	delete() {},
};
