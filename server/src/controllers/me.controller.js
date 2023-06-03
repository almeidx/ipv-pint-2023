const { body } = require("express-validator");
const { requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const { Utilizador } = require("../database/index.js");
const bcrypt = require("bcrypt");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	update: [
		requireLogin(),
		validate(
			body("name", "`name` tem que ser do tipo string").isString().isLength({ min: 1, max: 100 }).optional(),
			body("cv", "`cv` tem que ser do tipo string").isString().isLength({ min: 1, max: 100 }).optional(),
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
			// TODO: Update min length to 16
			body("passwordAtual", "`passwordAtual` tem que ser do tipo string").isString().isLength({ min: 1, max: 128 }),
			body("newPassword", "`newPassword` tem que ser do tipo string").isString().isLength({ min: 16, max: 128 }),
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
