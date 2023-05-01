const { TipoUtilizador } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async read(req, res) {
		res.json(await TipoUtilizador.findAll());
	},
};
