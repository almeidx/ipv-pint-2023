const { Reuniao } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async create(req, res) {
		const { idNegocio, idCandidatura, startTime, duration, title, description, subject } = req.body;

		try {
			const reuniao = await Reuniao.create({
				idNegocio,
				idCandidatura,
				startTime,
				duration,
				title,
				description,
				subject,
			});

			return res.json(reuniao);
		} catch (error) {
			console.error(error);

			res.status(500).json({
				message: "Internal server error",
				error,
			});
		}
	},

	async read(req, res) {
		res.json(await Reuniao.findAll());
	},

	update() {},

	delete_() {},
};
