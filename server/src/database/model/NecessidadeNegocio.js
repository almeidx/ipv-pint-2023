const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

const NecessidadeNegocio = sequelize.define(
	"necessidades_de_negocio",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_NECESSIDADE_NEGOCIO",
			allowNull: false,
			autoIncrement: true,
		},
		idNegocio: {
			type: DataTypes.INTEGER,
			field: "ID_OPORTUNIDADE",
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			field: "NOME_NECESSIDADE",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

module.exports = NecessidadeNegocio;
