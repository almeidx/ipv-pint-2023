const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

const TipoProjeto = sequelize.define(
	"tipos_de_projeto",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_TIPO_PROJETO",
			allowNull: false,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING,
			field: "NOME_TIPO_PROJETO",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

module.exports = TipoProjeto;
