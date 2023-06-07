const { requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const { Utilizador } = require("../database/index.js");
const bcrypt = require("bcrypt");
const { z } = require("zod");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	update: [
		requireLogin(),
		validate(
			z.object({
				name: z.string().min(1).max(100).optional(),
				cv: z.string().min(1).max(100).optional(),
			}),
		),

		async (req, res) => {
			const { name, cv } = req.body;

			const utilizador = await Utilizador.update(
				{
					cv,
					name,
				},
				{
					where: {
						id: req.user.id,
					},
				},
			);

			if (name) {
				req.session.passport.user.name = name;
			} else if (cv) {
				req.session.passport.user.cv = cv;
			}

			res.json(utilizador);
		},
	],

	updatePassword: [
		requireLogin(),
		validate(
			z.object({
				// TODO: Update min length to 16
				passwordAtual: z.string().min(1).max(128),
				newPassword: z.string().min(16).max(128),
			}),
		),

		async (req, res) => {
			const { passwordAtual, newPassword } = req.body;

			const utilizador = await Utilizador.findByPk(req.user.id, { attributes: ["id", "hashedPassword"] });
			if (!utilizador) {
				res.status(404).json({ message: "Utilizador não encontrado" });
				return;
			}

			const passwordMatches = await bcrypt.compare(passwordAtual, utilizador.hashedPassword);
			if (!passwordMatches) {
				res.status(401).json({ message: "Password incorreta" });
				return;
			}

			const hashedPassword = await bcrypt.hash(newPassword, 10);

			await utilizador.update({ hashedPassword });

			res.json({ message: "Password atualizada com sucesso" });
		},
	],
};
