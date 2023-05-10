const { Utilizador, TipoUtilizador } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async create(req, res) {
		const { idTipoUser, name, email, password, cv } = req.body;

		try {
			const utilizador = await Utilizador.create({
				idTipoUser,
				name,
				email,
				password,
				cv: cv ?? null,
			});

			res.json(utilizador);
		} catch (err) {
			console.error(err);

			res.status(500).json({
				message: "Internal server error",
			});
		}
	},

	async read(req, res) {
		const { id } = req.params;

		if (id) {
			const utilizador = await Utilizador.findByPk(id);

			if (!utilizador) {
				res.status(404).json({
					message: "Utilizador not found",
				});
			}

			res.json(utilizador);

			return;
		}

		res.json(
			await Utilizador.findAll({
				attributes: ["id", "name", "email", "lastLoginDate"],
				include: [
					{
						model: TipoUtilizador,
						as: "tipoUtilizador",
						attributes: ["name", "id"],
					},
				],
				order: [["id", "ASC"]],
			}),
		);
	},

	async update(req, res) {
		if (!req.user) {
			res.status(401).json({
				message: "Not logged in",
			});
			return;
		}

		if (req.user.tipoUtilizador.id !== 5) {
			res.status(403).json({
				message: "Not authorized",
			});
			return;
		}

		const { idTipoUser } = req.body;
		const { id } = req.params;

		const parsed = Number.parseInt(idTipoUser, 10);

		if (Number.isNaN(parsed) || idTipoUser < 0 || idTipoUser > 5) {
			return res.status(400).json({
				message: "Invalid idTipoUser",
			});
		}

		await Utilizador.update(
			{
				idTipoUser,
			},
			{
				where: {
					id,
				},
			},
		);
	},

	delete_() {},
};
