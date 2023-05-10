const { Notificacao } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create(req, res) {
		const { idUser, idReuniao, content, seen, type, additionalDate } = req.body;

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
	},

	async read(req, res) {
		if (!req.isAuthenticated()) {
			res.status(401).json({ message: "Não tem a sessão iniciada" });
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

	destroy() {},
};
