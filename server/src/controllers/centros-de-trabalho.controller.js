const { CentroTrabalho } = require("../database/index.js");
const { requireColaborador } = require("../middleware/authentication.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	read: [
		requireColaborador(),

		async (_req, res) => {
			res.json(
				await CentroTrabalho.findAll({
					order: [["name", "ASC"]],
				}),
			);
		},
	],
};
