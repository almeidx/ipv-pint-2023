const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Utilizador = require("./Utilizador.js");

const Cliente = sequelize.define(
	"clientes",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_CLIENTE",
			allowNull: false,
			autoIncrement: true,
		},
		idUser: {
			type: DataTypes.INTEGER,
			field: "ID_USER",
			allowNull: false,
		},
		name: {
			type: DataTypes.STRING,
			field: "NOME_CLIENTE",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

Cliente.belongsTo(Utilizador, { foreignKey: "idUser" });

module.exports = Cliente;
