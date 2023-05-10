const { Utilizador, Mensagem } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async create(req, res) {
		const { name, email, content } = req.body;

		if (!content) {
			res.status(400).json({ message: "Missing content" });
			return;
		}

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

	async read(req, res) {
		const mensagens = await Mensagem.findAll({
			include: [
				{
					model: Utilizador,
					as: "criador",
				},
			],
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

	destroy() {},
};
