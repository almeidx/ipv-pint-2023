const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");

const Vaga = sequelize.define(
	"vagas",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_VAGA",
			allowNull: false,
			autoIncrement: true,
		},
		amountSlots: {
			type: DataTypes.INTEGER,
			field: "QUANTIDADE_VAGAS",
			allowNull: false,
		},
		public: {
			type: DataTypes.BOOLEAN,
			field: "PUBLICA",
			allowNull: false,
		},
		icon: {
			type: DataTypes.STRING,
			field: "ICONE_VAGA",
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			field: "TITULO_VAGA",
			allowNull: false,
		},
		description: {
			type: DataTypes.STRING(1_000),
			field: "DESCRICAO_VAGA",
			allowNull: false,
		},
		status: {
			type: DataTypes.INTEGER,
			field: "ESTADO_VAGA",
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO_VAGA",
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{ timestamps: false },
);

module.exports = Vaga;
