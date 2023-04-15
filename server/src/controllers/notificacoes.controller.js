const { Notificacao } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create(req, res) {
		const { idUser, idReuniao, content, seen, type, additionalDate } = req.body;

		try {
			const notificacao = Notificacao.create({
				idUser,
				idReuniao,
				content,
				seen,
				createdAt: new Date(),
				type,
				additionalDate,
			});
			res.json(notificacao);
		} catch (error) {
			console.log(error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	async read(req, res) {
		res.json(await Notificacao.findAll());
	},

	update() {},

	delete() {},
};
