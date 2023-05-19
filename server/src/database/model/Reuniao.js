/*
create table REUNIOES (
   ID_REUNIAO           int                  not null,
   ID_OPORTUNIDADE      int                  null,
   ID_CANDIDATURA       int                  null,
   DATA_INICIO          datetime             not null,
   DURACAO_REUNIAO      int                  not null,
   TITULO_REUNIAO       text                 not null,
   DESCRICAO_REUNIAO    text                 not null,
   ASSUNTO_REUNIAO      text                 not null,
   constraint PK_REUNIOES primary key (ID_REUNIAO),
   constraint FK_REUNIOES_REUNIOES__NEGOCIOS foreign key (ID_OPORTUNIDADE)
      references NEGOCIOS (ID_OPORTUNIDADE),
   constraint FK_REUNIOES_REUNIAO_P_CANDIDAT foreign key (ID_CANDIDATURA)
      references CANDIDATURAS (ID_CANDIDATURA)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Negocio = require("./Negocio.js");
const Candidatura = require("./Candidatura.js");

const Reuniao = sequelize.define(
	"reunioes",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_REUNIAO",
			allowNull: false,
			autoIncrement: true,
		},
		idNegocio: {
			type: DataTypes.INTEGER,
			field: "ID_OPORTUNIDADE",
			// references: {
			// 	model: "negocios",
			// 	key: "id",
			// },
		},
		idCandidatura: {
			type: DataTypes.INTEGER,
			field: "ID_CANDIDATURA",
			// references: {
			// 	model: "candidaturas",
			// 	key: "id",
			// },
		},
		startTime: {
			type: DataTypes.DATE,
			field: "DATA_INICIO",
			allowNull: false,
		},
		duration: {
			type: DataTypes.INTEGER,
			field: "DURACAO_REUNIAO",
			allowNull: false,
		},
		title: {
			type: DataTypes.TEXT,
			field: "TITULO_REUNIAO",
			allowNull: false,
		},
		description: {
			type: DataTypes.TEXT(1_000),
			field: "DESCRICAO_REUNIAO",
			allowNull: false,
		},
		subject: {
			type: DataTypes.TEXT,
			field: "ASSUNTO_REUNIAO",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

Reuniao.hasOne(Negocio, { sourceKey: "idNegocio", foreignKey: "id" });
Reuniao.hasOne(Candidatura, { sourceKey: "idCandidatura", foreignKey: "id" });

module.exports = Reuniao;
