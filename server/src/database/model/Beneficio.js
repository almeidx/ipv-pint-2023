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

module.exports = sequelize.define("beneficios", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_BENEFICIO",
	},
	idUser: {
		type: DataTypes.INTEGER,
		field: "ID_USER",
	},
	dataValidade: {
		type: DataTypes.DATE,
		field: "DATA_VALIDADE",
	},
	content: {
		type: DataTypes.STRING,
		field: "CONTEUDO_BENEFICIO",
	},
	shortContent: {
		type: DataTypes.STRING,
		field: "DESCRICAO_PEQUENA",
	},
	iconeBeneficio: {
		type: DataTypes.STRING,
		field: "ICONE_BENEFICIO",
	},
});
