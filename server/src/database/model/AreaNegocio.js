const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

const AreaNegocio = sequelize.define(
	"area_de_negocio",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_AREA_NEGOCIO",
			allowNull: false,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			field: "NOME_AREA",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

module.exports = AreaNegocio;
