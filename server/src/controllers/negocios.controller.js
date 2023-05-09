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

/** @type {import("../database/index.js").Controller} */
module.exports = {
	create(req, res) {
		const { idAreaNegocio, idCliente, idCentroTrabalho, description, title, status } = req.body;

		try {
			const negocio = Negocio.create({
				idAreaNegocio,
				idCliente,
				idCentroTrabalho,
				description,
				title,
				status,
			});

			res.json(negocio);
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Internal server error" });
		}
	},

	async read(req, res) {
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
		};

		if (admin !== undefined) {
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

	update() {},

	delete_() {},
};
