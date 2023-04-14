/*
create table AREA_DE_NEGOCIO (
   ID_AREA_NEGOCIO      int                  not null,
   NOME_AREA            text                 not null,
   constraint PK_AREA_DE_NEGOCIO primary key (ID_AREA_NEGOCIO)
)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define(
	"area_de_negocio",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_AREA_NEGOCIO",
			allowNull: false,
			autoIncrement: true,
		},
		nome: {
			type: DataTypes.STRING,
			field: "NOME_AREA",
			allowNull: false,
		},
	},
	{ timestamps: false },
);
