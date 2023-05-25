const { body, param } = require("express-validator");
const {
	Negocio,
	Cliente,
	AreaNegocio,
	CentroTrabalho,
	Utilizador,
	ContactoNegocio,
	Contacto,
	EstadoNegocio,
	sequelize,
} = require("../database/index.js");
const { requireLogin, checkPermissionStandalone } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

const fieldValidations = [
	body("idAreaNegocio", "`idAreaNegocio` tem que ser do tipo inteiro").isInt(),
	body("idCliente", "`idCliente` tem que ser do tipo inteiro").isInt(),
	body("description", "`description` tem que ser do tipo string e ter entre 1 e 100 caracteres")
		.isString()
		.isLength({ min: 1, max: 200 }),
	body("title", "`title` tem que ser do tipo string e ter entre 1 e 100 caracteres")
		.isString()
		.isLength({ min: 1, max: 100 }),
	body("contactos", "`contactos` tem que ser do tipo array").isArray(),
	body("contactos.*", "`contactos.*` tem que ser do tipo inteiro").isInt(),
];

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requireLogin(),
		validate(...fieldValidations),

		async (req, res) => {
			const { idAreaNegocio, idCliente, idCentroTrabalho, description, title, contactos } = req.body;

			const negocio = await Negocio.create({
				idUser: req.user.id,
				idAreaNegocio,
				idCliente,
				idCentroTrabalho,
				description,
				title,
			});

			await ContactoNegocio.bulkCreate(
				contactos.map((idContacto) => ({
					idNegocio: negocio.id,
					idContacto,
				})),
			);

			res.json(negocio);
		},
	],

	read: [
		requireLogin(),

		async (req, res) => {
			const { admin } = req.query;

			const opts = {
				attributes: ["id", "description", "title"],
				include: [
					{
						model: Cliente,
						as: "cliente",
						attributes: ["id", "name"],
					},
					{
						model: AreaNegocio,
						as: "areaNegocio",
						attributes: ["id", "name"],
					},
					{
						model: CentroTrabalho,
						as: "centroTrabalho",
						attributes: ["id", "name", "location", "postalCode", "address"],
					},
					{
						model: ContactoNegocio,
						as: "contactos",
						attributes: ["idContacto"],
						include: [
							{
								model: Contacto,
								attributes: ["id", "value", "type"],
							},
						],
					},
					{
						model: EstadoNegocio,
						as: "estados",
						attributes: ["estado", "dataFinalizacao"],
						order: [["estado", "ASC"]],
					},
				],
				order: [["id", "ASC"]],
			};

			if (admin !== undefined) {
				if (!checkPermissionStandalone(req, res, TipoUtilizadorEnum.Administrador)) return;

				opts.attributes.push("createdAt");
				opts.include.push(
					{
						model: Utilizador,
						as: "criador",
						attributes: ["name", "email"],
					},
					{
						model: Utilizador,
						as: "funcionarioResponsavel",
						attributes: ["name", "email"],
					},
				);
			} else {
				opts.where = { idUser: req.user.id };
			}

			const negocios = await Negocio.findAll(opts);

			for (const negocio of negocios) {
				negocio.estados.sort((a, b) => a.estado - b.estado);
			}

			res.json(negocios);
		},
	],

	update: [
		requireLogin(),
		validate(
			param("id", "`id` tem que ser do tipo inteiro").isInt(),
			body("idCentroTrabalho", "`idCentroTrabalho` tem que ser do tipo inteiro").isInt().optional(),
			body("idFuncionarioResponsavel", "`idFuncionarioResponsavel` tem que ser do tipo inteiro").isInt().optional(),
			body("estados", "`estados` tem que ser do tipo array").isArray().isLength({ min: 1, max: 5 }).optional(),
			body("estados.*.estado", "`estados.*.estado` tem que ser do tipo inteiro").isInt(),
			body("estados.*.dataFinalizacao", "`estados.*.dataFinalizacao` tem que ser do tipo data").isISO8601(),
			...fieldValidations.map((v) => v.optional()),
		),

		async (req, res) => {
			const { id } = req.params;
			const { idAreaNegocio, idCliente, idCentroTrabalho, description, title, contactos, estados } = req.body;

			// TODO: Check if user is allowed to update this negocio

			const negocio = await Negocio.findByPk(id);
			if (!negocio) {
				res.status(404).json({ message: "Negocio não encontrado" });
				return;
			}

			const update = {};

			if (idAreaNegocio !== undefined && idAreaNegocio !== negocio.idAreaNegocio) update.idAreaNegocio = idAreaNegocio;
			if (idCliente !== undefined && idCliente !== negocio.idCliente) update.idCliente = idCliente;
			if (idCentroTrabalho !== undefined && idCentroTrabalho !== negocio.idCentroTrabalho)
				update.idCentroTrabalho = idCentroTrabalho;
			if (description && description !== negocio.description) update.description = description;
			if (title && title !== negocio.title) update.title = title;

			await sequelize.transaction(async (transaction) => {
				let updatedNegocio;
				if (Object.keys(update).length > 0) updatedNegocio = await negocio.update(update, { transaction });
				else updatedNegocio = negocio;

				if (contactos) {
					await ContactoNegocio.destroy({ where: { idNegocio: negocio.id } }, { transaction });
					await ContactoNegocio.bulkCreate(
						contactos.map((idContacto) => ({
							idNegocio: negocio.id,
							idContacto,
						})),
						{ transaction },
					);

					updatedNegocio.contactos = contactos;
				}

				if (estados) {
					const estadoNumbers = estados.map(({ estado }) => estado);
					const maxEstado = Math.max(...estadoNumbers);
					if (maxEstado !== estadoNumbers.length - 1) {
						res.status(400).json({ message: "Estados têm que ser inseridos por ordem" });
						throw new Error("Estados têm que ser inseridos por ordem");
					}

					await EstadoNegocio.destroy({ where: { idNegocio: negocio.id } }, { transaction });
					await EstadoNegocio.bulkCreate(
						estados.map(({ estado, dataFinalizacao }) => ({
							idNegocio: negocio.id,
							estado,
							dataFinalizacao,
						})),
						{ transaction },
					);

					updatedNegocio.estados = estados;
				}

				res.json(updatedNegocio);
			});
		},
	],
};
