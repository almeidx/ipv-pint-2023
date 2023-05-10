const { Candidatura } = require("../database/index.js");
const Utilizador = require("../database/model/Utilizador.js");
const Vaga = require("../database/model/Vaga.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create(req, res) {},

	async read(req, res) {
		res.json(
			await Candidatura.findAll({
				include: [{ model: Utilizador, as: "utilizador" }, Vaga],
				order: [["id", "ASC"]],
			}),
		);
	},

	update() {},

	destroy() {},
};
