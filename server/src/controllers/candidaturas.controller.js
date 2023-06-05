const { body, param } = require("express-validator");
const { Candidatura } = require("../database/index.js");
const Utilizador = require("../database/model/Utilizador.js");
const Vaga = require("../database/model/Vaga.js");
const { requireLogin, requirePermission, checkPermissionStandalone } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requireLogin(),
		validate(
			param("id", "`id` tem que ser do tipo inteiro").isInt(),
			body("refEmail", "`refEmail` tem que ser um email").isEmail().optional(),
		),

		async (req, res) => {
			const { refEmail } = req.body;
			const { id } = req.params;

			const vaga = await Vaga.findByPk(id);
			if (!vaga) {
				res.status(404).json({ message: "Vaga não encontrada" });
				return;
			}

			const candidatura = await Candidatura.create({
				idUser: req.user.id,
				idVaga: id,
				refEmail,
			});

			res.json(candidatura);
		},
	],

	read: [
		requireLogin(),

		async (req, res) => {
			const { admin } = req.query;

			if (admin !== undefined) {
				if (!checkPermissionStandalone(req, res, TipoUtilizadorEnum.GestorRecursosHumanos)) return;

				res.json(
					await Candidatura.findAll({
						include: [
							{
								model: Utilizador,
								as: "utilizador",
								attributes: ["id", "name"],
							},
							{
								model: Vaga,
								attributes: ["id", "title"],
							},
						],
						attributes: ["id", "submissionDate", "refEmail", "conclusionAt"],
						order: [["id", "ASC"]],
					}),
				);

				return;
			}

			res.json(
				await Candidatura.findAll({
					where: {
						idUser: req.user.id,
					},
					include: [Vaga],
					order: [["submissionDate", "ASC"]],
				}),
			);
		},
	],

	concluir: [
		requirePermission(TipoUtilizadorEnum.GestorRecursosHumanos),
		validate(param("id", "`id` tem que ser do tipo inteiro").isInt()),

		async (req, res) => {
			const { id } = req.params;

			const candidatura = await Candidatura.findByPk(id);
			if (!candidatura) {
				res.status(404).json({ message: "Candidatura não encontrada" });
				return;
			}

			res.json(await Candidatura.update({ conclusionAt: new Date() }, { where: { id } }));
		},
	],
};
