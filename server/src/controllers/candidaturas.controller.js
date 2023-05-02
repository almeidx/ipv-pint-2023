const { Candidatura } = require("../database/index.js");
const Utilizador = require("../database/model/Utilizador.js");
const Vaga = require("../database/model/Vaga.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create(req, res) {},

	async read(req, res) {
		const data = (
			await Candidatura.findAll({
				include: [Utilizador, Vaga],
			})
		).map((candidatura) => candidatura.toJSON());

		res.json(
			data.map(({ utilizadore, ...candidatura }) => ({
				...candidatura,
				utilizador: utilizadore,
			})),
		);
	},

	update() {},

	delete_() {},
};
