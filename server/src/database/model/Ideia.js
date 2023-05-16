/*
create table IDEIAS (
   ID_IDEIA             int                  not null,
   ID_USER              int                  not null,
   UTI_ID_USER          int                  null,
   CONTEUDO_IDEIA       text                 not null,
   CATEGORIA            text                 not null,
   DATA_CRIACAO_IDEIA   datetime             not null,
   IDEIA_VALIDADA       bit                  not null,
   constraint PK_IDEIAS primary key (ID_IDEIA),
   constraint FK_IDEIAS_IDEIAS_CR_UTILIZAD foreign key (ID_USER)
      references UTILIZADORES (ID_USER),
   constraint FK_IDEIAS_VALIDADOR_UTILIZAD foreign key (UTI_ID_USER)
      references UTILIZADORES (ID_USER)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Utilizador = require("./Utilizador.js");

const Ideia = sequelize.define(
	"ideias",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_IDEIA",
			allowNull: false,
			autoIncrement: true,
		},
		idCriador: {
			type: DataTypes.INTEGER,
			field: "ID_USER",
			allowNull: false,
			// references: {
			// 	model: "utilizadores",
			// 	key: "id",
			// },
		},
		idValidador: {
			type: DataTypes.INTEGER,
			field: "UTI_ID_USER",
			// references: {
			// 	model: "utilizadores",
			// 	key: "id",
			// },
		},
		content: {
			type: DataTypes.STRING(1_000),
			field: "CONTEUDO_IDEIA",
			allowNull: false,
		},
		categoria: {
			type: DataTypes.STRING,
			field: "CATEGORIA",
			allowNull: false,
		},
		dataCriacao: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO_IDEIA",
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		ideiaValidada: {
			type: DataTypes.BOOLEAN,
			field: "IDEIA_VALIDADA",
			allowNull: false,
			defaultValue: false,
		},
	},
	{ timestamps: false },
);

Ideia.belongsTo(Utilizador, { foreignKey: "idCriador", targetKey: "id", as: "utilizador" });
Ideia.hasOne(Utilizador, { foreignKey: "id", sourceKey: "idValidador", as: "validador" });

module.exports = Ideia;
