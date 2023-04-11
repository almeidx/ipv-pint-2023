/*
create table NOTIFICACOES (
   ID_NOTIFICACAO       int                  not null,
   ID_TIPO_NOTIFICACAO  int                  not null,
   ID_USER              int                  not null,
   ID_REUNIAO           int                  null,
   CONTEUDO_NOTIFICACAO text                 not null,
   VISTA                bit                  not null,
   DATA_CRIACAO_NOTIFICACAO datetime             not null,
   constraint PK_NOTIFICACOES primary key (ID_NOTIFICACAO),
   constraint FK_NOTIFICA_TIPO_DE_N_TIPOS_DE foreign key (ID_TIPO_NOTIFICACAO)
      references TIPOS_DE_NOTIFICACAO (ID_TIPO_NOTIFICACAO),
   constraint FK_NOTIFICA_NOTIFICAC_UTILIZAD foreign key (ID_USER)
      references UTILIZADORES (ID_USER),
   constraint FK_NOTIFICA_NOTIFICAC_REUNIOES foreign key (ID_REUNIAO)
      references REUNIOES (ID_REUNIAO)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("notificacoes", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_NOTIFICACAO",
	},
	idTipoNotificacao: {
		type: DataTypes.INTEGER,
		field: "ID_TIPO_NOTIFICACAO",
	},
	idUser: {
		type: DataTypes.INTEGER,
		field: "ID_USER",
	},
	idReuniao: {
		type: DataTypes.INTEGER,
		field: "ID_REUNIAO",
	},
	content: {
		type: DataTypes.TEXT,
		field: "CONTEUDO_NOTIFICACAO",
	},
	seen: {
		type: DataTypes.BOOLEAN,
		field: "VISTA",
	},
	createdAt: {
		type: DataTypes.DATE,
		field: "DATA_CRIACAO_NOTIFICACAO",
	},
});
