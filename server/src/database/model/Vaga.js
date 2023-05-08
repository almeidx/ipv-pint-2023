/*
create table VAGAS (
   ID_VAGA              int                  not null,
   QUANTIDADE_VAGAS     int                  not null,
   PUBLICA              bit                  not null,
   ICONE_VAGA           text                 not null,
   TITULO_VAGA          text                 not null,
   DESCRICAO_VAGA       text                 not null,
   ESTADO_VAGA          int                  not null,
   constraint PK_VAGAS primary key (ID_VAGA)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

const Vaga = sequelize.define(
	"vagas",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_VAGA",
			allowNull: false,
			autoIncrement: true,
		},
		amountSlots: {
			type: DataTypes.INTEGER,
			field: "QUANTIDADE_VAGAS",
			allowNull: false,
		},
		public: {
			type: DataTypes.BOOLEAN,
			field: "PUBLICA",
			allowNull: false,
		},
		icon: {
			type: DataTypes.STRING,
			field: "ICONE_VAGA",
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			field: "TITULO_VAGA",
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING,
			field: "DESCRICAO_VAGA",
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
			field: "ESTADO_VAGA",
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO_VAGA",
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{ timestamps: false },
);

module.exports = Vaga;
