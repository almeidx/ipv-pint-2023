const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define(
	"mensagens",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_MENSAGEM",
			allowNull: false,
			autoIncrement: true,
		},
		idCriador: {
			type: DataTypes.INTEGER,
			field: "ID_USER",
			// references: {
			// 	model: "utilizadores",
			// 	key: "id",
			// },
		},
		name: {
			type: DataTypes.STRING,
			field: "NOME_CRIADOR_MENSAGEM",
		},
		email: {
			type: DataTypes.STRING,
			field: "EMAIL_CRIADOR_MENSAGEM",
		},
		content: {
			type: DataTypes.STRING,
			field: "CONTEUDO_MENSAGEM",
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO_MENSAGEM",
			allowNull: false,
		},
	},
	{ timestamps: false },
);
