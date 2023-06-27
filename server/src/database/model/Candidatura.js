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
		},
		idUser: {
			type: DataTypes.INTEGER,
			field: "ID_USER",
			allowNull: false,
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
Candidatura.belongsTo(Vaga, { foreignKey: "idVaga", onDelete: "CASCADE" });

module.exports = Candidatura;
