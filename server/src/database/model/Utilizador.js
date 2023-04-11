/*
create table UTILIZADORES (
   ID_USER              int                  not null,
   ID_TIPO_USER         int                  not null,
  //  ID_IDEIA             int                  null,
   NOME_USER            text                 not null,
   EMAIL                text                 not null,
   PASSWORD             text                 not null,
   HAS_CONFIRMED        bit                  not null,
   CV                   text                 null,
   NOVA_PASSWORD_CODE   text                 null,
   NOVA_PASSWORD_DATA   datetime             null,
   CONFIRM_CODE         text                 null,
   CONFIRM_DATE_START   datetime             null,
   constraint PK_UTILIZADORES primary key (ID_USER),
   constraint FK_UTILIZAD_UTILIZADO_TIPOS_DE foreign key (ID_TIPO_USER)
      references TIPOS_DE_UTILIZADOR (ID_TIPO_USER),
   constraint FK_UTILIZAD_VALIDADOR_IDEIAS foreign key (ID_IDEIA)
      references IDEIAS (ID_IDEIA)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("utilizadores", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_USER",
	},
	idUserType: {
		type: DataTypes.INTEGER,
		field: "ID_TIPO_USER",
	},
	name: {
		type: DataTypes.STRING,
		field: "NOME_USER",
	},
	email: {
		type: DataTypes.STRING,
		field: "EMAIL",
	},
	password: {
		type: DataTypes.STRING,
		field: "PASSWORD",
	},
	hasConfirmed: {
		type: DataTypes.BOOLEAN,
		field: "HAS_CONFIRMED",
	},
	cv: {
		type: DataTypes.STRING,
		field: "CV",
	},
	newPasswordCode: {
		type: DataTypes.STRING,
		field: "NOVA_PASSWORD_CODE",
	},
	newPasswordDate: {
		type: DataTypes.DATE,
		field: "NOVA_PASSWORD_DATA",
	},
	confirmCode: {
		type: DataTypes.STRING,
		field: "CONFIRM_CODE",
	},
	confirmDateStart: {
		type: DataTypes.DATE,
		field: "CONFIRM_DATE_START",
	},
});
