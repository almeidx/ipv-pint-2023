const { body, param } = require("express-validator");
const { Notificacao } = require("../database/index.js");
const { requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	// create(req, res) {
	// 	const { idUser, idReuniao, content, seen, type, additionalDate } = req.body;

	// 	const notificacao = Notificacao.create({
	// 		idUser,
	// 		idReuniao,
	// 		content,
	// 		seen,
	// 		createdAt: new Date(),
	// 		type,
	// 		additionalDate,
	// 	});

	// 	res.json(notificacao);
	// },

	read: [
		requireLogin(),
		async (req, res) => {
			res.json(
				await Notificacao.findAll({
					where: {
						idUser: req.user.id,
					},
				}),
			);
		},
	],

	update: [
		requireLogin(),
		validate(
			param("id", "`id` tem que ser do tipo inteiro").isInt(),
			body("seen", "`seen` tem que ser do tipo boolean").isBoolean(),
		),

		async (req, res) => {
			const { id } = req.params;
			const { seen } = req.body;

			const notificacao = await Notificacao.findByPk(id);
			if (!notificacao) {
				res.status(404).json({ message: "Notificação não encontrada" });
				return;
			}

			res.json(await notificacao.update({ seen }));
		},
	],
};
