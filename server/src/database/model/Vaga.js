/*
create table VAGAS (
   ID_VAGA              int                  not null,
   QUANTIDADE_VAGAS     int                  not null,
   PUBLICA              bit                  not null,
   ICONE_VAGA           text                 not null,
   TITULO_VAGA          text                 not null,
   DESCRICAO_VAGA       text                 not null,
   ESTADO_VAGA          int                  not null,
   constraint PK_VAGAS primary key (ID_VAGA)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("vagas", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_VAGA",
	},
	amountSlots: {
		type: DataTypes.INTEGER,
		field: "QUANTIDADE_VAGAS",
	},
	public: {
		type: DataTypes.BOOLEAN,
		field: "PUBLICA",
	},
	icon: {
		type: DataTypes.STRING,
		field: "ICONE_VAGA",
	},
	title: {
		type: DataTypes.STRING,
		field: "TITULO_VAGA",
	},
	description: {
		type: DataTypes.STRING,
		field: "DESCRICAO_VAGA",
	},
	status: {
		type: DataTypes.INTEGER,
		field: "ESTADO_VAGA",
	},
});
