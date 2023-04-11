/*
create table CONTACTOS (
   ID_CONTACTO          int                  not null,
   ID_CLIENTE           int                  not null,
   VALOR_CONTACTO       text                 not null,
   TIPO_CONTACTO        int                  not null,
   constraint PK_CONTACTOS primary key (ID_CONTACTO),
   constraint FK_CONTACTO_CONTACTOS_CLIENTES foreign key (ID_CLIENTE)
      references CLIENTES (ID_CLIENTE)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("contactos", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_CONTACTO",
	},
	idClient: {
		type: DataTypes.INTEGER,
		field: "ID_CLIENTE",
	},
	value: {
		type: DataTypes.STRING,
		field: "VALOR_CONTACTO",
	},
	type: {
		type: DataTypes.INTEGER,
		field: "TIPO_CONTACTO",
	},
});
