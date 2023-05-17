const { Op } = require("sequelize");
const { body, param } = require("express-validator");
const { Beneficio, Utilizador } = require("../database/index.js");
const { requirePermission, checkPermissionStandalone } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

const fieldValidations = [
	body("content", "`content` tem que ser do tipo string e ter entre 1 e 1000 caracteres")
		.isString()
		.isLength({ min: 1, max: 1_000 }),
	body("shortContent", "`shortContent` tem que ser do tipo string e ter entre 1 e 100 caracteres")
		.isString()
		.isLength({ min: 1, max: 100 }),
	body("iconeBeneficio", "`iconeBeneficio` tem que ser do tipo string e ter entre 1 e 100 caracteres")
		.isString()
		.isLength({ min: 1, max: 100 }),
	body("dataValidade", "`dataValidade` tem que ser do tipo data").isISO8601(),
];

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

	async read(req, res, next) {
		const { admin } = req.query;

		const opts = {
			attributes: ["id", "content", "shortContent", "iconeBeneficio"],
			order: [
				["dataValidade", "ASC"],
				["id", "ASC"],
			],
		};

		if (admin !== undefined) {
			if (!checkPermissionStandalone(req, res, TipoUtilizadorEnum.Administrador)) return;

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

	update: [
		requirePermission(TipoUtilizadorEnum.GestorConteudos),
		validate([param("id", "`id` tem que ser do tipo inteiro").isInt(), ...fieldValidations.map((v) => v.optional())]),

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

			res.status(204).json({ message: "Beneficio apagado" });
		},
	],
};
