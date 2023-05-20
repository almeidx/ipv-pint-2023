const { body } = require("express-validator");
const { Cliente } = require("../database/index.js");
const { requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requireLogin(),
		validate(
			body("name", "`name` tem que ser do tipo string e ter entre 1 e 100 caracteres")
				.isString()
				.isLength({ min: 1, max: 100 }),
		),

		async (req, res) => {
			const { name } = req.body;

			const cliente = await Cliente.create({
				idUser: req.user.id,
				name,
			});

			res.json(cliente);
		},
	],

	read: [
		requireLogin(),
		async (req, res) => {
			res.json(
				await Cliente.findAll({
					where: {
						idUser: req.user.id,
					},
					order: [["name", "ASC"]],
				}),
			);
		},
	],
};
