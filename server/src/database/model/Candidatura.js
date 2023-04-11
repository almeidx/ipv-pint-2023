/*
create table CANDIDATOS (
   ID_CANDIDATO         int                  not null,
   ID_VAGA              int                  not null,
   ID_USER              int                  not null,
   DATA_SUBMISSAO       datetime             not null,
   EMAIL_REFERENCIA     text                 null,
   constraint PK_CANDIDATOS primary key (ID_CANDIDATO),
   constraint FK_CANDIDAT_CANDIDATU_VAGAS foreign key (ID_VAGA)
      references VAGAS (ID_VAGA),
   constraint FK_CANDIDAT_CANDIDACO_UTILIZAD foreign key (ID_USER)
      references UTILIZADORES (ID_USER)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

module.exports = sequelize.define("candidaturas", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_CANDIDATO",
	},
	idVaga: {
		type: DataTypes.INTEGER,
		field: "ID_VAGA",
	},
	idUser: {
		type: DataTypes.INTEGER,
		field: "ID_USER",
	},
	submissionDate: {
		type: DataTypes.DATE,
		field: "DATA_SUBMISSAO",
	},
	refEmail: {
		type: DataTypes.STRING,
		field: "EMAIL_REFERENCIA",
	},
});
