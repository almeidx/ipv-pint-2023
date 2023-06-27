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
			allowNull: false,
		},
		dataValidade: {
			type: DataTypes.DATE,
			field: "DATA_VALIDADE",
		},
		content: {
			type: DataTypes.STRING(1_000),
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
		createdAt: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO_BENEFICIO",
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{ timestamps: false },
);

Beneficio.hasOne(Utilizador, { foreignKey: "id", sourceKey: "idCriador", as: "utilizador" });

module.exports = Beneficio;
