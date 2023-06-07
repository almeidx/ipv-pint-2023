const { Op } = require("sequelize");
const { Beneficio, Utilizador } = require("../database/index.js");
const { requirePermission, checkPermissionStandalone } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");
const { z } = require("zod");
const { ISO_DATETIME_REGEX } = require("../utils/constants.js");

const fieldValidations = z.object({
	content: z.string().min(1).max(1000),
	shortContent: z.string().min(1).max(100),
	iconeBeneficio: z.string().min(1).max(100),
	dataValidade: z.string().regex(ISO_DATETIME_REGEX),
});

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requirePermission(TipoUtilizadorEnum.GestorConteudos),
		validate(fieldValidations),

		async (req, res) => {
			const { dataValidade, content, shortContent, iconeBeneficio } = req.body;

			const beneficio = await Beneficio.create({
				idCriador: req.user.id,
				dataValidade,
				content,
				shortContent,
				iconeBeneficio,
			});

			res.json(beneficio);
		},
	],

	async read(req, res) {
		const { admin } = req.query;

		const opts = {
			attributes: ["id", "content", "shortContent", "iconeBeneficio", "dataValidade"],
			order: [
				["dataValidade", "ASC"],
				["id", "ASC"],
			],
		};

		if (admin !== undefined) {
			if (!checkPermissionStandalone(req, res, TipoUtilizadorEnum.GestorConteudos)) return;

			opts.attributes.push("createdAt");
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

	update: [
		requirePermission(TipoUtilizadorEnum.GestorConteudos),
		validate(fieldValidations.partial()),

		async (req, res) => {
			const { id } = req.params;
			const { dataValidade, content, shortContent, iconeBeneficio } = req.body;

			const beneficio = await Beneficio.findByPk(id);
			if (!beneficio) {
				res.status(404).json({ error: "Beneficio não encontrado" });
				return;
			}

			const update = {};

			if (dataValidade && dataValidade !== beneficio.dataValidade) update.dataValidade = dataValidade;
			if (content && content !== beneficio.content) update.content = content;
			if (shortContent && shortContent !== beneficio.shortContent) update.shortContent = shortContent;
			if (iconeBeneficio && iconeBeneficio !== beneficio.iconeBeneficio) update.iconeBeneficio = iconeBeneficio;

			if (Object.keys(update).length === 0) {
				res.status(400).json({ message: "Não houve alterações" });
				return;
			}

			res.json(await beneficio.update(update));
		},
	],

	destroy: [
		requirePermission(TipoUtilizadorEnum.GestorConteudos),

		async (req, res) => {
			const { id } = req.params;

			await Beneficio.destroy({ where: { id } });

			res.status(200).json({ message: "Beneficio apagado" });
		},
	],
};
