const { Beneficio } = require("../database/index.js");

exports.BeneficiosController = {
	create(req, res) {},

	async read(req, res) {
		res.json(await Beneficio.findAll());
	},

	update() {},

	delete() {},
};
