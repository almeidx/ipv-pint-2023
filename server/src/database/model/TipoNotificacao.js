/*
create table TIPOS_DE_NOTIFICACAO (
   ID_TIPO_NOTIFICACAO  int                  not null,
   NOME_TIPO_NOTIFICACAO text                 not null,
   constraint PK_TIPOS_DE_NOTIFICACAO primary key (ID_TIPO_NOTIFICACAO)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("tipos_de_notificacao", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_TIPO_NOTIFICACAO",
	},
	name: {
		type: DataTypes.TEXT,
		field: "NOME_TIPO_NOTIFICACAO",
	},
});