const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Cliente = require("./Cliente.js");

const Contacto = sequelize.define(
	"contactos",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_CONTACTO",
			allowNull: false,
			autoIncrement: true,
		},
		idCliente: {
			type: DataTypes.INTEGER,
			field: "ID_CLIENTE",
			allowNull: false,
		},
		value: {
			type: DataTypes.STRING,
			field: "VALOR_CONTACTO",
			allowNull: false,
		},
		type: {
			type: DataTypes.INTEGER,
			field: "TIPO_CONTACTO",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

Contacto.belongsTo(Cliente, { foreignKey: "idCliente" });

module.exports = Contacto;
