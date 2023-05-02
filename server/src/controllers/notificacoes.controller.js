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
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	async read(req, res) {
		if (!req.isAuthenticated()) {
			res.status(401).json({
				message: "Not logged in",
			});
			return;
		}

		res.json(
			await Notificacao.findAll({
				where: {
					idUser: req.user.id,
				},
			}),
		);
	},

	update() {},

	delete_() {},
};
