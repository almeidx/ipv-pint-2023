/*
create table ESTADOS_NEGOCIO (
   ESTADO               int                  not null,
   ID_OPORTUNIDADE      int                  not null,
   DATA_FINALIZACAO     datetime             not null,
   constraint PK_ESTADOS_NEGOCIO primary key (ID_OPORTUNIDADE),
   constraint PK_ESTADOS_NEGOCIO primary key (ESTADO),
   constraint FK_ESTADOS__ESTADOS_D_NEGOCIOS foreign key (ID_OPORTUNIDADE)
      references NEGOCIOS (ID_OPORTUNIDADE)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Negocio = require("./Negocio.js");

const EstadoNegocio = sequelize.define(
	"estados_negocio",
	{
		estado: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ESTADO",
			allowNull: false,
		},
		idNegocio: {
			type: DataTypes.INTEGER,
			field: "ID_OPORTUNIDADE",
			allowNull: false,
			primaryKey: true,
			// references: {
			// 	model: "negocios",
			// 	key: "id",
			// },
		},
		dataFinalizacao: {
			type: DataTypes.DATE,
			field: "DATA_FINALIZACAO",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

EstadoNegocio.belongsTo(Negocio, { foreignKey: "idNegocio" });

module.exports = EstadoNegocio;
