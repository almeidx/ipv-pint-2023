const { body } = require("express-validator");
const {
	Negocio,
	Cliente,
	AreaNegocio,
	CentroTrabalho,
	Utilizador,
	ContactoNegocio,
	Contacto,
	EstadoNegocio,
} = require("../database/index.js");
const { requireLogin, checkPermissionStandalone } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");

const fieldValidations = [
	body("idAreaNegocio", "`idAreaNegocio` tem que ser do tipo inteiro").isInt(),
	body("idCliente", "`idCliente` tem que ser do tipo inteiro").isInt(),
	body("description", "`description` tem que ser do tipo string e ter entre 1 e 100 caracteres")
		.isString()
		.isLength({ min: 1, max: 100 }),
	body("title", "`title` tem que ser do tipo string e ter entre 1 e 100 caracteres")
		.isString()
		.isLength({ min: 1, max: 100 }),
	body("status", "`status` tem que ser do tipo int e estar entre 1 e 3").isInt({ min: 1, max: 3 }),
	body("contactos", "`contactos` tem que ser do tipo array").isArray(),
	body("contactos.*", "`contactos.*` tem que ser do tipo inteiro").isInt(),
];

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create: [
		requireLogin(),
		validate(fieldValidations),

		async (req, res) => {
			const { idAreaNegocio, idCliente, idCentroTrabalho, description, title, status, contactos } = req.body;

			const negocio = await Negocio.create({
				idUser: req.user.id,
				idAreaNegocio,
				idCliente,
				idCentroTrabalho,
				description,
				title,
				status,
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
				attributes: ["id", "description", "title", "status"],
				include: [
					{
						model: Cliente,
						as: "cliente",
						attributes: ["name"],
					},
					{
						model: AreaNegocio,
						as: "areaNegocio",
						attributes: ["name"],
					},
					{
						model: CentroTrabalho,
						as: "centroTrabalho",
						attributes: ["name", "location", "postalCode", "address"],
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
			}

			res.json(await Negocio.findAll(opts));
		},
	],

	update: [
		requireLogin(),
		validate(fieldValidations.map((v) => v.optional())),

		async (req, res) => {
			const { id } = req.params;
			const { idAreaNegocio, idCliente, idCentroTrabalho, description, title, status, contactos } = req.body;

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
			if (status !== undefined && status !== negocio.status) update.status = status;

			let updatedNegocio;
			if (Object.keys(update).length > 0) updatedNegocio = await negocio.update(update);
			else updatedNegocio = negocio;

			if (contactos) {
				await ContactoNegocio.destroy({ where: { idNegocio: negocio.id } });
				await ContactoNegocio.bulkCreate(
					contactos.map((idContacto) => ({
						idNegocio: negocio.id,
						idContacto,
					})),
				);

				updatedNegocio.contactos = contactos;
			}

			res.json(updatedNegocio);
		},
	],
};
