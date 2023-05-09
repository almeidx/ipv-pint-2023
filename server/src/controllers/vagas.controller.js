const { Vaga } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async create(req, res) {
		const { amountSlots, public, icon, title, description, status } = req.body;

		try {
			const vaga = await Vaga.create({
				amountSlots,
				public,
				icon,
				title,
				description,
				status,
			});

			res.json(vaga);
		} catch (error) {
			console.error(error);

			res.status(500).json({
				message: "Internal server error",
				error,
			});
		}
	},

	async read(req, res) {
		const { admin } = req.query;

		const attributes = ["id", "amountSlots", "public", "icon", "title", "description", "status"];

		if (admin !== undefined) {
			attributes.push("createdAt");
		}

		res.json(
			await Vaga.findAll({
				attributes,
				order: [["id", "ASC"]],
			}),
		);
	},

	update() {},

	delete_() {},
};
