const { Reuniao, Utilizador, Candidatura, Vaga, Negocio } = require("../database/index.js");
const { requireLogin } = require("../middleware/authentication.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	read: [
		requireLogin(),
		async (req, res) => {
			const opts = {
				include: [
					{
						model: Utilizador,
						as: "utilizadores",
						attributes: [],
					},
					// {
					// 	model: Negocio,
					// 	attributes: ["id", "title"],
					// },
					// {
					// 	model: Candidatura,
					// 	attributes: ["id"],
					// 	include: [
					// 		{
					// 			model: Vaga,
					// 			attributes: ["id", "title"],
					// 		},
					// 	],
					// },
				],
				attributes: ["id", "startTime", "duration", "title", "description", "subject"],
			};

			if (req.user.tipoUtilizador.id !== TipoUtilizadorEnum.Administrador) {
				opts.where = {
					"$utilizadores.ID_USER$": req.user.id,
				};
			}

			const reunioes = await Reuniao.findAll(opts);

			res.json(reunioes);
		},
	],
};
