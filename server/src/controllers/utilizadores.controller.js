const { Utilizador } = require("../database/index.js");

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
			console.log(err);

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

		res.json(await Utilizador.findAll());
	},

	update() {},

	delete() {},
};
