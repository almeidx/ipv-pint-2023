const { Reuniao, Utilizador, Candidatura, Negocio, Vaga, Notificacao, sequelize } = require("../database/index.js");
const { requirePermission, requireLogin, checkPermissionStandalone } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");
const TipoNotificacaoEnum = require("../utils/TipoNotificacaoEnum.js");
const { z } = require("zod");
const { ISO_DATETIME_REGEX } = require("../utils/constants.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requirePermission(TipoUtilizadorEnum.GestorRecursosHumanos),
		validate(
			z.object({
				idNegocio: z.number().int().optional(),
				idCandidatura: z.number().int().optional(),
				startTime: z.string().regex(ISO_DATETIME_REGEX),
				duration: z.number().int(),
				title: z.string().min(1).max(100),
				description: z.string().min(1).max(100),
				subject: z.string().min(1).max(100),
				utilizadores: z.array(z.number().int()),
			}),
		),

		async (req, res) => {
			const { idNegocio, idCandidatura, startTime, duration, title, description, subject, utilizadores } = req.body;

			try {
				await sequelize.transaction(async (transaction) => {
					const reuniao = await Reuniao.create(
						{
							idNegocio,
							idCandidatura,
							startTime,
							duration,
							title,
							description,
							subject,
						},
						{ transaction },
					);

					const uniqueUtilizadores = [...new Set([utilizadores, req.user.id])];

					await reuniao.setUtilizadores(uniqueUtilizadores, { transaction });

					await Notificacao.bulkCreate(
						uniqueUtilizadores.map((utilizador) => [
							{
								idUser: utilizador,
								idReuniao: reuniao.id,
								content: reuniao.title,
								type: TipoNotificacaoEnum.Reuniao,
								additionalDate: reuniao.startTime,
							},
						]),
						{ transaction },
					);

					res.json(reuniao);
				});
			} catch (error) {
				res.status(500).json({ error: error.message });
			}
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
};
