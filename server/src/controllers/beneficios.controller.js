const { Beneficio, Utilizador } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create(req, res) {
		const { dataValidade, content, shortContent, iconeBeneficio } = req.body;

		try {
			const beneficio = Beneficio.create({
				dataValidade,
				content,
				shortContent,
				iconeBeneficio,
			});

			res.json(beneficio);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	async read(req, res) {
		res.json(
			await Beneficio.findAll({
				include: [
					{
						model: Utilizador,
						as: "utilizador",
					},
				],
			}),
		);
	},

	update() {},

	delete_() {},
};
