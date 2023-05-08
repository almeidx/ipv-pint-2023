const { literal, Op } = require("sequelize");
const { Utilizador, Candidatura, Negocio } = require("../database/index.js");

const DEFAULT_INTERVAL = 30;

module.exports = {
	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async candidaturas(req, res) {
		res.json(
			await Candidatura.count({
				where: {
					submissionDate: {
						[Op.gte]: resolveDateDiff(req),
					},
				},
			}),
		);
	},

	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async negocios(req, res) {
		res.json(
			await Negocio.count({
				where: {
					createdAt: {
						[Op.gte]: resolveDateDiff(req),
					},
				},
			}),
		);
	},

	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async utilizadores(req, res) {
		res.json(
			await Utilizador.count({
				where: {
					createdAt: {
						[Op.gte]: resolveDateDiff(req),
					},
				},
			}),
		);
	},
};

/** @param {import("express").Request} req */
function resolveDateDiff(req) {
	const { interval } = req.query;

	if (interval === "all") {
		return "1970-01-01";
	}

	const parsedInterval = interval ? Math.max(Number.parseInt(interval, 10), 1) || DEFAULT_INTERVAL : DEFAULT_INTERVAL;
	return literal(`NOW() - INTERVAL '${parsedInterval}d'`);
}
