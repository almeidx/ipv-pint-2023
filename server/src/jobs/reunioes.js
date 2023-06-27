const { Op } = require("sequelize");
const { Reuniao, Notificacao } = require("../database/index");
const TipoNotificacaoEnum = require("../utils/TipoNotificacaoEnum.js");

const REUNIAO_REMINDER_TIME = 30 * 60 * 1_000; // 30m

const notifiedReunioes = new Set();

setInterval(async () => {
	const now = new Date();

	const reunioes = await Reuniao.findAll({
		where: {
			startTime: {
				[Op.between]: [now, new Date(now.getTime() + REUNIAO_REMINDER_TIME)],
			},
		},
	});

	if (!reunioes.length) return;

	const reunioesComUsers = await Promise.all(
		reunioes.map(async (reuniao) => ({
			utilizadores: await reuniao.getUsers(),
			reuniao,
		})),
	);

	await Notificacao.bulkCreate(
		reunioesComUsers
			.map(({ utilizadores, reuniao }) =>
				utilizadores.map((utilizador) => ({
					type: TipoNotificacaoEnum.Reuniao,
					content: `A reunião "${reuniao.title}" começa em 30 minutos`,
					idUser: utilizador.id,
					idReuniao: reuniao.id,
				})),
			)
			.flat(),
	);

	reunioes.forEach((reuniao) => notifiedReunioes.add(reuniao.id));
}, 60 * 1_000); // 5m
