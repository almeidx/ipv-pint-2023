const { body } = require("express-validator");
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
				include: [{ model: Utilizador, as: "criador", attributes: ["id", "email", "name"] }],
			});

			res.json(
				mensagens
					.map((m) => m.toJSON())
					.map(({ criador, name, email, ...mensagem }) => ({
						...mensagem,
						criador: criador ?? { name, email },
						registered: !!criador,
					})),
			);
		},
	],

	destroy: [async () => {}],
};
