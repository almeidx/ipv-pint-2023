const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

const NotaEntrevista = sequelize.define(
	"notas_de_entrevista",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_NOTA",
			allowNull: false,
			autoIncrement: true,
		},
		idReuniao: {
			type: DataTypes.INTEGER,
			field: "ID_REUNIAO",
			allowNull: false,
		},
		content: {
			type: DataTypes.STRING(1_000),
			field: "CONTEUDO_NOTA",
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO_NOTA",
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{ timestamps: false },
);

module.exports = NotaEntrevista;
