/*
create table CANDIDATURAS (
   ID_CANDIDATURA       int                  not null,
   ID_VAGA              int                  not null,
   ID_USER              int                  not null,
   DATA_SUBMISSAO       datetime             not null,
   EMAIL_REFERENCIA     text                 null,
   constraint PK_CANDIDATURAS primary key (ID_CANDIDATURA),
   constraint FK_CANDIDAT_CANDIDATU_VAGAS foreign key (ID_VAGA)
      references VAGAS (ID_VAGA),
   constraint FK_CANDIDAT_CANDIDACO_UTILIZAD foreign key (ID_USER)
      references UTILIZADORES (ID_USER)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Vaga = require("./Vaga.js");
const Utilizador = require("./Utilizador.js");

const Candidatura = sequelize.define(
	"candidaturas",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_CANDIDATO",
			allowNull: false,
			autoIncrement: true,
		},
		idVaga: {
			type: DataTypes.INTEGER,
			field: "ID_VAGA",
			allowNull: false,
			// references: {
			// 	model: "vagas",
			// 	key: "id",
			// },
		},
		idUser: {
			type: DataTypes.INTEGER,
			field: "ID_USER",
			allowNull: false,
			// references: {
			// 	model: "utilizadores",
			// 	key: "id",
			// },
		},
		submissionDate: {
			type: DataTypes.DATE,
			field: "DATA_SUBMISSAO",
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		refEmail: {
			type: DataTypes.STRING,
			field: "EMAIL_REFERENCIA",
		},
		conclusionAt: {
			type: DataTypes.DATE,
			field: "DATA_CONCLUSAO",
		},
	},
	{ timestamps: false },
);

Candidatura.belongsTo(Utilizador, { foreignKey: "idUser", as: "utilizador" });
Candidatura.belongsTo(Vaga, { foreignKey: "idVaga" });

module.exports = Candidatura;
