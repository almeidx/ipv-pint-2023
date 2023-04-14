/*
create table NECESSIDADES_DE_NEGOCIO (
   ID_NECESSIDADE_NEGOCIO int                  not null,
   ID_OPORTUNIDADE      int                  not null,
   NOME_NECESSIDADE     text                 not null,
   constraint PK_NECESSIDADES_DE_NEGOCIO primary key (ID_NECESSIDADE_NEGOCIO),
   constraint FK_NECESSID_NECESSIDA_NEGOCIOS foreign key (ID_OPORTUNIDADE)
      references NEGOCIOS (ID_OPORTUNIDADE)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Negocio = require("./Negocio.js");

const NecessidadeNegocio = sequelize.define(
	"necessidades_de_negocio",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_NECESSIDADE_NEGOCIO",
			allowNull: false,
			autoIncrement: true,
		},
		idNegocio: {
			type: DataTypes.INTEGER,
			field: "ID_OPORTUNIDADE",
			allowNull: false,
			// references: {
			// 	model: "negocios",
			// 	key: "id",
			// },
		},
		name: {
			type: DataTypes.TEXT,
			field: "NOME_NECESSIDADE",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

NecessidadeNegocio.belongsTo(Negocio, { foreignKey: "idNegocio" });

module.exports = NecessidadeNegocio;
