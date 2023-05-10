const { Reuniao } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async create(req, res) {
		const { idNegocio, idCandidatura, startTime, duration, title, description, subject } = req.body;

		const reuniao = await Reuniao.create({
			idNegocio,
			idCandidatura,
			startTime,
			duration,
			title,
			description,
			subject,
		});

		res.json(reuniao);
	},

	async read(_req, res) {
		res.json(await Reuniao.findAll());
	},

	update() {},

	destroy() {},
};
