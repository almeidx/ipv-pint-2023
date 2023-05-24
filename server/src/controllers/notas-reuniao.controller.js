const { param, body } = require("express-validator");
const { NotaEntrevista, Reuniao, Vaga, Candidatura, Utilizador } = require("../database/index.js");
const { requirePermission } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requirePermission(TipoUtilizadorEnum.GestorRecursosHumanos),
		validate(
			param("id", "`id` tem que ser do tipo inteiro").isInt(),
			body("content", "`content` tem que ser do tipo string").isString().isLength({ min: 1, max: 1_000 }),
		),

		async (req, res) => {
			const { id } = req.params;
			const { content } = req.body;

			const reuniao = await Reuniao.findByPk(id);
			if (!reuniao) {
				res.status(404).json({ message: "Reunião não encontrada" });
				return;
			}

			const nota = await NotaEntrevista.create({
				idReuniao: id,
				content,
			});

			res.json(nota);
		},
	],

	read: [
		requirePermission(TipoUtilizadorEnum.GestorRecursosHumanos),
		validate(param("id", "`id` tem que ser do tipo inteiro").isInt()),

		async (req, res) => {
			const { id } = req.params;

			const reuniao = await Reuniao.findByPk(id, {
				where: {
					idReuniao: id,
				},
				include: [
					{
						model: Candidatura,
						attributes: ["id"],
						include: [
							{
								model: Vaga,
								attributes: ["id", "title"],
							},
							{
								model: Utilizador,
								attributes: ["id", "name"],
								as: "utilizador",
							},
						],
					},
					{
						model: NotaEntrevista,
						attributes: ["id", "content", "createdAt"],
						order: [["id", "ASC"]],
					},
				],
				attributes: ["id"],
			});

			if (!reuniao) {
				res.status(404).json({ message: "Reunião não encontrada" });
				return;
			}

			const { notas_de_entrevista: notas, ...rest } = reuniao.toJSON();

			res.json({ ...rest, notas });
		},
	],

	destroy: [
		requirePermission(TipoUtilizadorEnum.GestorRecursosHumanos),
		validate(
			param("id", "`id` tem que ser do tipo inteiro").isInt(),
			param("idNote", "`idNote` tem que ser do tipo inteiro").isInt(),
		),

		async (req, res) => {
			const { id, idNote } = req.params;

			const nota = await NotaEntrevista.findOne({
				where: {
					idReuniao: id,
					id: idNote,
				},
			});

			if (!nota) {
				res.status(404).json({ message: "Nota não encontrada" });
				return;
			}

			await nota.destroy();

			res.json({ message: "Nota eliminada com sucesso" });
		},
	],
};