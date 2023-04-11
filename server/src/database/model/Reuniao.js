/*
create table REUNIOES (
   ID_REUNIAO           int                  not null,
   ID_OPORTUNIDADE      int                  null,
   ID_NOTIFICACAO       int                  null,
   DATA_INICIO          datetime             not null,
   DURACAO_REUNIAO      int                  not null,
   TITULO_REUNIAO       text                 not null,
   DESCRICAO_REUNIAO    text                 not null,
   ASSUNTO_REUNIAO      text                 not null,
   constraint PK_REUNIOES primary key (ID_REUNIAO),
   constraint FK_REUNIOES_REUNIOES__NEGOCIOS foreign key (ID_OPORTUNIDADE)
      references NEGOCIOS (ID_OPORTUNIDADE),
   constraint FK_REUNIOES_NOTIFICAC_NOTIFICA foreign key (ID_NOTIFICACAO)
      references NOTIFICACOES (ID_NOTIFICACAO)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("reunioes", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_REUNIAO",
	},
	idNegocio: {
		type: DataTypes.INTEGER,
		field: "ID_OPORTUNIDADE",
	},
	idNotificacao: {
		type: DataTypes.INTEGER,
		field: "ID_NOTIFICACAO",
	},
	startTime: {
		type: DataTypes.DATE,
		field: "DATA_INICIO",
	},
	duration: {
		type: DataTypes.INTEGER,
		field: "DURACAO_REUNIAO",
	},
	title: {
		type: DataTypes.TEXT,
		field: "TITULO_REUNIAO",
	},
	description: {
		type: DataTypes.TEXT,
		field: "DESCRICAO_REUNIAO",
	},
	subject: {
		type: DataTypes.TEXT,
		field: "ASSUNTO_REUNIAO",
	},
});
