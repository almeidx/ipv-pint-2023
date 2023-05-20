const { body } = require("express-validator");
const { requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const { Utilizador } = require("../database/index.js");

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
};
