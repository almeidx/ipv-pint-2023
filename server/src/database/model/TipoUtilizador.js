const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

const TipoDeUtilizador = sequelize.define(
	"tipos_de_utilizador",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_TIPO_USER",
			allowNull: false,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			field: "NOME_TIPO_USER",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

module.exports = TipoDeUtilizador;
