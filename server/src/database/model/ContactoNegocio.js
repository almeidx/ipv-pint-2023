/*
create table CONTACTOS_DE_NEGOCIO (
   ID_OPORTUNIDADE      int                  not null,
   ID_CONTACTO          int                  not null,
   constraint PK_CONTACTOS_DE_NEGOCIO primary key (ID_OPORTUNIDADE, ID_CONTACTO),
   constraint FK_CONTACTO_CONTACTOS_NEGOCIOS foreign key (ID_OPORTUNIDADE)
      references NEGOCIOS (ID_OPORTUNIDADE),
   constraint FK_CONTACTO_CONTACTOS_CONTACTO foreign key (ID_CONTACTO)
      references CONTACTOS (ID_CONTACTO)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("contactos_de_negocio", {
	idNegocio: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_OPORTUNIDADE",
	},
	idContacto: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_CONTACTO",
	},
});
