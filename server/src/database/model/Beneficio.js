/*
create table BENEFICIOS (
   ID_BENEFICIO         int                  not null,
   ID_USER              int                  not null,
   DATA_VALIDADE        datetime             null,
   CONTEUDO_BENEFICIO   text                 not null,
   DESCRICAO_PEQUENA    text                 not null,
   ICONE_BENEFICIO      text                 not null,
   constraint PK_BENEFICIOS primary key (ID_BENEFICIO),
   constraint FK_BENEFICI_BENEFICIO_UTILIZAD foreign key (ID_USER)
      references UTILIZADORES (ID_USER)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Utilizador = require("./Utilizador.js");

const Beneficio = sequelize.define(
	"beneficios",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_BENEFICIO",
			allowNull: false,
			autoIncrement: true,
		},
		idCriador: {
			type: DataTypes.INTEGER,
			field: "ID_USER",
			// references: {
			// 	model: "utilizadores",
			// 	key: "id",
			// },
			allowNull: false,
		},
		dataValidade: {
			type: DataTypes.DATE,
			field: "DATA_VALIDADE",
		},
		content: {
			type: DataTypes.STRING,
			field: "CONTEUDO_BENEFICIO",
			allowNull: false,
		},
		shortContent: {
			type: DataTypes.STRING,
			field: "DESCRICAO_PEQUENA",
			allowNull: false,
		},
		iconeBeneficio: {
			type: DataTypes.STRING,
			field: "ICONE_BENEFICIO",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

Beneficio.hasOne(Utilizador, { foreignKey: "id", sourceKey: "idCriador" });

module.exports = Beneficio;
