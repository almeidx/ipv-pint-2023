/*
create table ESTADOS_NEGOCIO (
   ESTADO               int                  not null,
   ID_OPORTUNIDADE      int                  not null,
   DATA_FINALIZACAO     datetime             not null,
   constraint PK_ESTADOS_NEGOCIO primary key (ESTADO),
   constraint FK_ESTADOS__ESTADOS_D_NEGOCIOS foreign key (ID_OPORTUNIDADE)
      references NEGOCIOS (ID_OPORTUNIDADE)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("estados_negocio", {
	estado: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ESTADO",
	},
	idNegocio: {
		type: DataTypes.INTEGER,
		field: "ID_OPORTUNIDADE",
	},
	dataFinalizacao: {
		type: DataTypes.DATE,
		field: "DATA_FINALIZACAO",
	},
});
