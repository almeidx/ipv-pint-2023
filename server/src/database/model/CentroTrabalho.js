const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

const CentroTrabalho = sequelize.define(
	"centros_de_trabalho",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_CENTRO_TRABALHO",
			allowNull: false,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			field: "NOME_CENTRO",
			allowNull: false,
		},
		location: {
			type: DataTypes.STRING,
			field: "LOCALIZACAO_CENTRO",
			allowNull: false,
		},
		postalCode: {
			type: DataTypes.STRING,
			field: "CODIGO_POSTAL",
			allowNull: false,
		},
		address: {
			type: DataTypes.STRING,
			field: "ENDERECO_CENTRO",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

module.exports = CentroTrabalho;
