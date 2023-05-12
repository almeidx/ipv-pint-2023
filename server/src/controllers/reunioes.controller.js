const { body } = require("express-validator");
const { Reuniao, Utilizador, Candidatura, Negocio, Vaga } = require("../database/index.js");
const { requirePermission, requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requirePermission(TipoUtilizadorEnum.GestorRecursosHumanos),
		validate(
			body("idNegocio", "`idNegocio` tem que ser do tipo inteiro").isInt().optional(),
			body("idCandidatura", "`idCandidatura` tem que ser do tipo inteiro").isInt().optional(),
			body("startTime", "`startTime` tem que ser do tipo data").isDate(),
			body("duration", "`duration` tem que ser do tipo inteiro").isInt(),
			body("title", "`title` tem que ser do tipo string e ter entre 1 e 100 caracteres")
				.isString()
				.isLength({ min: 1, max: 100 }),
			body("description", "`description` tem que ser do tipo string e ter entre 1 e 100 caracteres")
				.isString()
				.isLength({ min: 1, max: 100 }),
			body("subject", "`subject` tem que ser do tipo string e ter entre 1 e 100 caracteres")
				.isString()
				.isLength({ min: 1, max: 100 }),
			body("utilizadores", "`utilizadores` tem que ser do tipo array").isArray(),
			body("utilizadores.*", "`utilizadores.*` tem que ser do tipo inteiro").isInt(),
		),

		async (req, res) => {
			const { idNegocio, idCandidatura, startTime, duration, title, description, subject, utilizadores } = req.body;

			const reuniao = await Reuniao.create({
				idNegocio,
				idCandidatura,
				startTime,
				duration,
				title,
				description,
				subject,
			});

			reuniao.setUtilizadores(utilizadores);

			res.json(reuniao);
		},
	],

	read: [
		requireLogin(),
		async (req, res) => {
			const { reunioes } = (
				await Utilizador.findByPk(req.user.id, {
					attributes: [],
					include: {
						model: Reuniao,
						attributes: ["id", "startTime", "duration", "title", "description", "subject"],
						include: [
							{
								model: Candidatura,
								attributes: ["id"],
								include: [
									{
										model: Vaga,
										attributes: ["id", "title"],
									},
								],
							},
							{
								model: Negocio,
								attributes: ["id", "title"],
							},
						],
					},
				})
			).toJSON();

			res.json(reunioes.map(({ reunioes_utilizadores, ...reuniao }) => reuniao));
		},
	],
};
