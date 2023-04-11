/*
create table NECESSIDADES_DE_NEGOCIO (
   ID_NECESSIDADE_NEGOCIO int                  not null,
   ID_OPORTUNIDADE      int                  null,
   NOME_NECESSIDADE     text                 not null,
   constraint PK_NECESSIDADES_DE_NEGOCIO primary key (ID_NECESSIDADE_NEGOCIO),
   constraint FK_NECESSID_NECESSIDA_NEGOCIOS foreign key (ID_OPORTUNIDADE)
      references NEGOCIOS (ID_OPORTUNIDADE)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("necessidades_negocio", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_NECESSIDADE_NEGOCIO",
	},
	idNegocio: {
		type: DataTypes.INTEGER,
		field: "ID_OPORTUNIDADE",
	},
	name: {
		type: DataTypes.TEXT,
		field: "NOME_NECESSIDADE",
	},
});
