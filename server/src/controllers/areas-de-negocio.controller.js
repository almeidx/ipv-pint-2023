const { AreaNegocio } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	read: [
		async (_req, res) => {
			res.json(
				await AreaNegocio.findAll({
					order: [["name", "ASC"]],
				}),
			);
		},
	],
};
