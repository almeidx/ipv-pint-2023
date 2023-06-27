const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Utilizador = require("./Utilizador.js");
const Reuniao = require("./Reuniao.js");

const Notificacao = sequelize.define(
	"notificacoes",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_NOTIFICACAO",
			allowNull: false,
			autoIncrement: true,
		},
		idUser: {
			type: DataTypes.INTEGER,
			field: "ID_USER",
			allowNull: false,
		},
		idReuniao: {
			type: DataTypes.INTEGER,
			field: "ID_REUNIAO",
		},
		content: {
			type: DataTypes.STRING,
			field: "CONTEUDO_NOTIFICACAO",
			allowNull: false,
		},
		seen: {
			type: DataTypes.BOOLEAN,
			field: "VISTA",
			allowNull: false,
			defaultValue: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO_NOTIFICACAO",
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		/**
		 * 0 - Reunião
		 * 1 - Benefício
		 * 2 - Vaga
		 * 3 - Negócio
		 */
		type: {
			type: DataTypes.INTEGER,
			field: "TIPO_NOTIFICACAO",
			allowNull: false,
		},
		additionalDate: {
			type: DataTypes.DATE,
			field: "DATA_ADICIONAL",
		},
	},
	{ timestamps: false },
);

Notificacao.belongsTo(Utilizador, { foreignKey: "idUser" });
Notificacao.hasOne(Reuniao, { sourceKey: "idReuniao", foreignKey: "id" });

module.exports = Notificacao;
