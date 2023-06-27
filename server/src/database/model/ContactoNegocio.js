const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Negocio = require("./Negocio.js");
const Contacto = require("./Contacto.js");

const ContactoNegocio = sequelize.define(
	"contactos_de_negocio",
	{
		idNegocio: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_OPORTUNIDADE",
			allowNull: false,
		},
		idContacto: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_CONTACTO",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

ContactoNegocio.belongsTo(Negocio, { foreignKey: "idNegocio" });
ContactoNegocio.belongsTo(Contacto, { foreignKey: "idContacto" });

module.exports = ContactoNegocio;
