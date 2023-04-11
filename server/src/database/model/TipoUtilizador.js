/*
create table TIPOS_DE_UTILIZADOR (
	ID_TIPO_USER         int                  not null,
	NOME_TIPO_USER       text                 not null,
	constraint PK_TIPOS_DE_UTILIZADOR primary key (ID_TIPO_USER)
)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("tipos_utilizador", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_TIPO_USER",
	},
	name: {
		type: DataTypes.STRING,
		field: "NOME_TIPO_USER",
	},
});
