const { Reuniao, Utilizador, Candidatura, Vaga } = require("../database/index.js");
const { requireLogin } = require("../middleware/authentication.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	read: [
		requireLogin(),
		async (req, res) => {
			const reunioes = await Reuniao.findAll({
				where: {
					'$utilizadores.ID_USER$': req.user.id
				},
				include: [
					{
						model: Utilizador,
						as: 'utilizadores',
						attributes: []
					},
					{
						modal: Candidatura,
						as: 'candidatura',
						attributes: [],
						include: [
							{
								model: Vaga,
								as: "vaga",
								// attributes: [""]
							}
						],
					},
				],
			});

			res.json(reunioes);
		},
	],
};
