const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Negocio = require("./Negocio.js");

const EstadoNegocio = sequelize.define(
	"estados_negocio",
	{
		estado: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ESTADO",
			allowNull: false,
		},
		idNegocio: {
			type: DataTypes.INTEGER,
			field: "ID_OPORTUNIDADE",
			allowNull: false,
			primaryKey: true,
		},
		dataFinalizacao: {
			type: DataTypes.DATE,
			field: "DATA_FINALIZACAO",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

EstadoNegocio.belongsTo(Negocio, { foreignKey: "idNegocio" });

module.exports = EstadoNegocio;
