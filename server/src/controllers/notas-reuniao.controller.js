const {
	NotaEntrevista,
	Reuniao,
	Vaga,
	Candidatura,
	Utilizador,
	Negocio,
	TipoProjeto,
} = require("../database/index.js");
const { requirePermission } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");
const { z } = require("zod");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requirePermission(TipoUtilizadorEnum.GestorRecursosHumanos),
		validate(
			z
				.object({
					content: z.string().min(1).max(1000),
				})
				.strict(),
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
								attributes: ["title"],
							},
							{
								model: Utilizador,
								attributes: ["name"],
								as: "utilizador",
							},
						],
					},
					{
						model: Negocio,
						attributes: ["id", "title"],
						include: [
							{
								model: Utilizador,
								attributes: ["name"],
								as: "criador",
							},
							{
								model: TipoProjeto,
								attributes: ["name"],
								as: "tipoProjeto",
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
