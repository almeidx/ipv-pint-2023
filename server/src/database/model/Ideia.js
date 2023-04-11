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

module.exports = sequelize.define("ideias", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_IDEIA",
	},
	idUser: {
		type: DataTypes.INTEGER,
		field: "ID_USER",
	},
	validatorId: {
		type: DataTypes.INTEGER,
		field: "UTI_ID_USER",
	},
	content: {
		type: DataTypes.STRING,
		field: "CONTEUDO_IDEIA",
	},
	categoria: {
		type: DataTypes.STRING,
		field: "CATEGORIA",
	},
	dataCriacao: {
		type: DataTypes.DATE,
		field: "DATA_CRIACAO_IDEIA",
	},
	ideiaValidada: {
		type: DataTypes.BOOLEAN,
		field: "IDEIA_VALIDADA",
	},
});
