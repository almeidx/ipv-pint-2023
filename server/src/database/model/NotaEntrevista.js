/*
create table NOTAS_DE_ENTREVISTA (
   ID_NOTA              int                  not null,
   ID_REUNIAO           int                  not null,
   CONTEUDO_NOTA        text                 not null,
   DATA_CRIACAO_NOTA    datetime             not null,
   constraint PK_NOTAS_DE_ENTREVISTA primary key (ID_NOTA),
   constraint FK_NOTAS_DE_NOTAS_DE__REUNIOES foreign key (ID_REUNIAO)
      references REUNIOES (ID_REUNIAO)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Reuniao = require("./Reuniao.js");

const NotaEntrevista = sequelize.define(
	"notas_de_entrevista",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_NOTA",
			allowNull: false,
			autoIncrement: true,
		},
		idReuniao: {
			type: DataTypes.INTEGER,
			field: "ID_REUNIAO",
			allowNull: false,
			// references: {
			// 	model: "reunioes",
			// 	key: "id",
			// },
		},
		content: {
			type: DataTypes.TEXT,
			field: "CONTEUDO_NOTA",
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO_NOTA",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

NotaEntrevista.belongsTo(Reuniao, { foreignKey: "idReuniao" });

module.exports = NotaEntrevista;
