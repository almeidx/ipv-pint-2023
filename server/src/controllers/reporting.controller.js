const { literal, Op } = require("sequelize");
const { Utilizador, Candidatura, Negocio, Beneficio, Ideia, Vaga, sequelize } = require("../database/index.js");

const DEFAULT_INTERVAL = 30;

module.exports = {
	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async beneficios(req, res) {
		res.json(await count(Beneficio, "createdAt", req));
	},

	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async candidaturas(req, res) {
		res.json(await count(Candidatura, "submissionDate", req));
	},

	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async ideias(req, res) {
		res.json(await count(Ideia, "dataCriacao", req));
	},

	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async negocios(req, res) {
		res.json(await count(Negocio, "createdAt", req));
	},

	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async utilizadores(req, res) {
		res.json(await count(Utilizador, "createdAt", req));
	},

	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async vagas(req, res) {
		res.json(await count(Vaga, "createdAt", req));
	},

	/**
	 * @param {import("express").Request} req
	 * @param {import("express").Response} res
	 */
	async negociosPorMes(_req, res) {
		const date = getDateFromOneYearAgo();

		const [result] = await sequelize.query(`
			SELECT DATE_TRUNC('month', "DATA_CRIACAO") AS mes, COUNT(*) AS quantidade
			FROM negocios
			GROUP BY mes
			HAVING DATE_TRUNC('month', "DATA_CRIACAO") >= '${date.toISOString()}'
		`);

		const data = [];
		const labels = [];
		for (let i = 11; i >= 0; i--) {
			const month = new Date();
			month.setMonth(month.getMonth() - i);
			month.setDate(1);
			month.setUTCHours(0, 0, 0, 0);

			const entry = result.find(
				(e) => e.mes.getMonth() === month.getMonth() && e.mes.getFullYear() === month.getFullYear(),
			);

			labels.push(month);
			data.push(entry ? Number.parseInt(entry.quantidade, 10) : 0);

			if (entry) {
				result.splice(result.indexOf(entry), 1);
			}
		}

		res.json({ data, labels });
	},

	async volumeNegociosPorEstado(_req, res) {
		const [data] = await sequelize.query(`
			SELECT "ESTADO" as estado, CAST(COUNT(*) AS INT) AS quantidade
			FROM estados_negocios
			INNER JOIN negocios
				ON negocios."ID_OPORTUNIDADE" = estados_negocios."ID_OPORTUNIDADE"
			GROUP BY estado
			ORDER BY estado ASC
		`);

		const result = {
			labels: [],
			data: [],
		};

		for (const { estado, quantidade } of data) {
			result.labels.push(estado);
			result.data.push(quantidade);
		}

		res.json(result);
	},
};

function getDateFromOneYearAgo() {
	const date = new Date();
	date.setMonth(date.getMonth() - 12);
	date.setDate(1);
	date.setUTCHours(0, 0, 0, 0);
	return date;
}

/**
 * @param {import("sequelize").ModelCtor<import("sequelize").Model<any, any>>} model
 * @param {string} field
 * @param {import("express").Request} req
 */
function count(model, field, req) {
	const diff = resolveDateDiff(req);

	return diff === "all"
		? model.count()
		: model.count({
				where: {
					[field]: {
						[Op.gte]: resolveDateDiff(req),
					},
				},
		  });
}

/** @param {import("express").Request} req */
function resolveDateDiff(req) {
	const { interval } = req.query;

	if (interval === "all") {
		return "all";
	}

	const parsedInterval = interval ? Math.max(Number.parseInt(interval, 10), 1) || DEFAULT_INTERVAL : DEFAULT_INTERVAL;
	return literal(`NOW() - INTERVAL '${parsedInterval}d'`);
}
