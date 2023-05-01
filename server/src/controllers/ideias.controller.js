const { Ideia, Utilizador } = require("../database/index.js");

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
			console.error(error);

			res.status(500).json({
				message: "Internal server error",
				error,
			});
		}
	},

	async read(req, res) {
		res.json(
			await Ideia.findAll({
				include: [
					{
						model: Utilizador,
						as: "utilizador",
						source: "idCriador",
					},
					{
						model: Utilizador,
						as: "validador",
						source: "idValidador",
					},
				],
			}),
		);
	},

	update() {},

	delete() {},
};
