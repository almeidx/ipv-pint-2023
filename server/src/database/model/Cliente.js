/*
create table CLIENTES (
   ID_CLIENTE           int                  not null,
   ID_USER              int                  not null,
   NOME_CLIENTE         text                 not null,
   constraint PK_CLIENTES primary key (ID_CLIENTE),
   constraint FK_CLIENTES_CLIENTES__UTILIZAD foreign key (ID_USER)
      references UTILIZADORES (ID_USER)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("clientes", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_CLIENTE",
	},
	idUser: {
		type: DataTypes.INTEGER,
		field: "ID_USER",
	},
	name: {
		type: DataTypes.STRING,
		field: "NOME_CLIENTE",
	},
});
