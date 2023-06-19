const {
	Reuniao,
	Utilizador,
	Candidatura,
	Negocio,
	Vaga,
	Notificacao,
	sequelize,
	NotaEntrevista,
} = require("../database/index.js");
const { requirePermission, requireLogin, checkPermissionStandalone } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");
const TipoNotificacaoEnum = require("../utils/TipoNotificacaoEnum.js");
const { z } = require("zod");
const { ISO_DATETIME_REGEX } = require("../utils/constants.js");

const fieldValidations = z
	.object({
		duration: z.number().int().nonnegative(),
		title: z.string().min(1).max(100),
		description: z.string().min(1).max(100),
		subject: z.string().min(1).max(100),
	})
	.strict();

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requirePermission(TipoUtilizadorEnum.GestorRecursosHumanos),
		validate(
			fieldValidations.extend({
				startTime: z.string().regex(ISO_DATETIME_REGEX),
				idNegocio: z.number().int().nonnegative().optional(),
				idCandidatura: z.number().int().nonnegative().optional(),
				utilizadores: z.array(z.number().int().nonnegative()),
			}),
		),

		async (req, res) => {
			const { idNegocio, idCandidatura, startTime, duration, title, description, subject, utilizadores } = req.body;

			if (typeof idNegocio === "number" && typeof idCandidatura === "number") {
				res.status(400).json({ message: "Reunião não pode ter um negócio e uma candidatura" });
				return;
			} else if (typeof idNegocio !== "number" && typeof idCandidatura !== "number") {
				res.status(400).json({ message: "Reunião tem de ter um negócio ou uma candidatura" });
				return;
			} else if (typeof idNegocio === "number" && !(await Negocio.findByPk(idNegocio))) {
				res.status(400).json({ message: "Negócio não existe" });
				return;
			} else if (typeof idCandidatura === "number" && !(await Candidatura.findByPk(idCandidatura))) {
				res.status(400).json({ message: "Candidatura não existe" });
				return;
			}

			const reuniao = await Reuniao.create({
				idNegocio,
				idCandidatura,
				startTime,
				duration,
				title,
				description,
				subject,
			});

			const uniqueUtilizadores = [...new Set([...utilizadores, req.user.id])];

			await reuniao.setUtilizadores(uniqueUtilizadores);

			await Notificacao.bulkCreate(
				uniqueUtilizadores.map((utilizador) => ({
					idUser: utilizador,
					idReuniao: reuniao.id,
					content: reuniao.title,
					type: TipoNotificacaoEnum.Reuniao,
					additionalDate: reuniao.startTime,
				})),
			);

			res.json(reuniao);
		},
	],

	read: [
		requireLogin(),

		async (req, res) => {
			const { admin } = req.query;

			if (admin !== undefined) {
				if (
					!checkPermissionStandalone(req, res, [
						TipoUtilizadorEnum.GestorNegocios,
						TipoUtilizadorEnum.GestorRecursosHumanos,
					])
				)
					return;

				res.json(
					await Reuniao.findAll({
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
					}),
				);

				return;
			}

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

	update: [
		requirePermission([TipoUtilizadorEnum.GestorNegocios, TipoUtilizadorEnum.GestorRecursosHumanos]),
		validate(fieldValidations.partial()),

		async (req, res) => {
			const { id } = req.params;
			const { duration, title, description, subject } = req.body;

			const reuniao = await Reuniao.findByPk(id);
			if (!reuniao) {
				res.status(404).json({ message: "Reunião não encontrada" });
				return;
			}

			const update = {};

			if (title && title !== reuniao.title) update.title = title;
			if (description && description !== reuniao.description) update.description = description;
			if (subject && subject !== reuniao.subject) update.subject = subject;
			if (duration !== undefined && duration !== reuniao.duration) update.duration = duration;

			res.json(await reuniao.update(update));
		},
	],

	destroy: [
		requirePermission([TipoUtilizadorEnum.GestorNegocios, TipoUtilizadorEnum.GestorRecursosHumanos]),

		async (req, res) => {
			const { id } = req.params;

			const reuniao = await Reuniao.findByPk(id);
			if (!reuniao) {
				res.status(404).json({ message: "Reunião não encontrada" });
				return;
			}

			await sequelize.transaction(async (transaction) => {
				await NotaEntrevista.destroy({ where: { idReuniao: id }, transaction });

				await reuniao.destroy({ transaction });
			});

			res.json({ message: "Reunião eliminada com sucesso" });
		},
	],
};
