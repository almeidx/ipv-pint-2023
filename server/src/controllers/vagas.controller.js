const { oneLine } = require("common-tags");
const { Op } = require("sequelize");
const { z } = require("zod");
const { Vaga, Candidatura, sequelize } = require("../database/index.js");
const { requirePermission, checkPermissionStandalone } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

const fieldValidations = z
	.object({
		amountSlots: z.number().int().nonnegative(),
		public: z.boolean(),
		icon: z.string().min(1).max(100),
		title: z.string().min(1).max(100),
		description: z.string().min(1).max(100),
		status: z.number().int().nonnegative().min(0).max(1),
	})
	.strict();

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requirePermission(TipoUtilizadorEnum.GestorConteudos),
		validate(fieldValidations),

		async (req, res) => {
			const { amountSlots, public, icon, title, description, status } = req.body;

			const vaga = await Vaga.create({
				amountSlots,
				public,
				icon,
				title,
				description,
				status,
			});

			res.json(vaga);
		},
	],

	async read(req, res) {
		const { admin } = req.query;

		const opts = {
			attributes: [
				"id",
				"amountSlots",
				"public",
				"icon",
				"title",
				"description",
				"status",
				[
					sequelize.literal(oneLine`
						(
							SELECT CAST(COUNT(*) AS INT)
							FROM candidaturas
							WHERE candidaturas."ID_VAGA" = vagas."ID_VAGA"
						)`),
					"slotsFilled",
				],
			],
			order: [["id", "ASC"]],
			where: {},
		};

		if (admin !== undefined) {
			if (!checkPermissionStandalone(req, res, TipoUtilizadorEnum.GestorRecursosHumanos)) return;

			opts.attributes.push("createdAt");
		} else {
			if (req.user?.id) {
				const candidaturas = await Candidatura.findAll({
					where: {
						idUser: req.user.id,
					},
					attributes: ["idVaga"],
				});

				opts.where.id = {
					[Op.notIn]: candidaturas.map((c) => c.idVaga),
				};
			}

			opts.where.status = 0;
		}

		if (!req.user || req.user.tipoUtilizador === TipoUtilizadorEnum.Utilizador) {
			opts.where.public = true;
		}

		res.json(await Vaga.findAll(opts));
	},

	update: [
		requirePermission(TipoUtilizadorEnum.GestorConteudos),
		validate(fieldValidations.partial()),

		async (req, res) => {
			const { id } = req.params;
			const { amountSlots, public, icon, title, description, status } = req.body;

			const vaga = await Vaga.findByPk(id);
			if (!vaga) {
				res.status(404).json({ message: "Vaga não encontrada" });
				return;
			}

			const update = {};

			if (amountSlots !== undefined && amountSlots !== vaga.amountSlots) update.amountSlots = amountSlots;
			if (public !== undefined && public !== vaga.public) update.public = public;
			if (icon && icon !== vaga.icon) update.icon = icon;
			if (title && title !== vaga.title) update.title = title;
			if (description && description !== vaga.description) update.description = description;
			if (status !== undefined && status !== vaga.status) update.status = status;

			if (Object.keys(update).length === 0) {
				res.status(400).json({ message: "Não houve alterações" });
				return;
			}

			res.json(await vaga.update(update));
		},
	],

	destroy: [
		requirePermission(TipoUtilizadorEnum.GestorConteudos),

		async (req, res) => {
			const { id } = req.params;

			const vaga = await Vaga.findByPk(id);
			if (!vaga) {
				res.status(404).json({ message: "Vaga não encontrada" });
				return;
			}

			await vaga.destroy();

			res.status(200).json({ message: "Vaga eliminada" });
		},
	],
};
