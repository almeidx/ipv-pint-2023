/*
create table CENTROS_DE_TRABALHO (
   ID_CENTRO_TRABALHO   int                  not null,
   NOME_CENTRO          text                 not null,
   LOCALIZACAO_CENTRO   text                 not null,
   CODIGO_POSTAL        text                 not null,
   ENDERECO_CENTRO      text                 not null,
   ID_CENTRO_GOOGLE_MAPS text                 not null,
   constraint PK_CENTROS_DE_TRABALHO primary key (ID_CENTRO_TRABALHO)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("centros_de_trabalho", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_CENTRO_TRABALHO",
	},
	name: {
		type: DataTypes.STRING,
		field: "NOME_CENTRO",
	},
	location: {
		type: DataTypes.STRING,
		field: "LOCALIZACAO_CENTRO",
	},
	postalCode: {
		type: DataTypes.STRING,
		field: "CODIGO_POSTAL",
	},
	address: {
		type: DataTypes.STRING,
		field: "ENDERECO_CENTRO",
	},
	googleMapsId: {
		type: DataTypes.STRING,
		field: "ID_CENTRO_GOOGLE_MAPS",
	},
});