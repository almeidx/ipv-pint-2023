const { body, param } = require("express-validator");
const { Utilizador, Mensagem } = require("../database/index.js");
const { requirePermission } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		validate(
			body("name", "`name` tem que ser do tipo string").isString().optional(),
			body("email", "`email` tem que ser um email").isEmail().optional(),
			body("content", "`content` tem que ser do tipo string e ter entre 1 e 1000 caracteres")
				.isString()
				.isLength({ min: 1, max: 1_000 }),
		),

		async (req, res) => {
			const { name, email, content } = req.body;

			const options = {
				content,
				createdAt: new Date(),
			};

			if (req.user) {
				options.idCriador = req.user.id;
			} else {
				if (!name || !email) {
					res.status(400).json({ message: "Tem que ter sessão iniciada ou passar `name` e `email`" });
					return;
				}

				options.name = name;
				options.email = email;
			}

			const mensagem = await Mensagem.create(options);

			res.json(mensagem);
		},
	],

	read: [
		requirePermission(TipoUtilizadorEnum.GestorConteudos),

		async (_req, res) => {
			const mensagens = await Mensagem.findAll({
				include: [{ model: Utilizador, as: "criador", attributes: ["id", "name", "email"] }],
			});

			res.json(
				mensagens
					.map((m) => m.toJSON())
					.map(({ criador, name, email, ...mensagem }) => ({
						...mensagem,
						criador: criador ?? { id: -1, name, email },
						registered: !!criador,
					})),
			);
		},
	],

	destroy: [
		requirePermission(TipoUtilizadorEnum.GestorConteudos),
		validate(param("id", "`id` tem que ser do tipo inteiro").isInt()),

		async (req, res) => {
			const { id } = req.params;

			const mensagem = await Mensagem.findByPk(id);
			if (!mensagem) {
				res.status(404).json({ message: "Mensagem não encontrada" });
				return;
			}

			await mensagem.destroy();

			res.json({ message: "Mensagem apagada com sucesso" });
		},
	],
};
