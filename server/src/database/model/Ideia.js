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
		},
		idValidador: {
			type: DataTypes.INTEGER,
			field: "UTI_ID_USER",
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
