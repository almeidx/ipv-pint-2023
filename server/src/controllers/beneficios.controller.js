const { Op } = require("sequelize");
const { Beneficio, Utilizador } = require("../database/index.js");

/** @type {import("../database/index.js").Controller} */
module.exports = {
	async create(req, res) {
		const { dataValidade, content, shortContent, iconeBeneficio } = req.body;

		try {
			const beneficio = await Beneficio.create({
				dataValidade,
				content,
				shortContent,
				iconeBeneficio,
			});

			res.json(beneficio);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async read(req, res) {
		const { admin } = req.query;

		const opts = {
			attributes: ["id", "content", "shortContent", "iconeBeneficio"],
			order: [["dataValidade", "ASC"]],
		};

		if (admin !== undefined) {
			// TODO: check if user is admin

			opts.attributes.push("dataValidade", "createdAt");
			opts.include = [
				{
					model: Utilizador,
					as: "utilizador",
					attributes: ["id", "name"],
				},
			];
		} else {
			opts.where = {
				dataValidade: {
					[Op.gte]: new Date(),
				},
			};
		}

		res.json(await Beneficio.findAll(opts));
	},

	update() {},

	delete_() {},
};
