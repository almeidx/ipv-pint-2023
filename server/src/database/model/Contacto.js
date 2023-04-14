/*
create table CONTACTOS (
   ID_CONTACTO          int                  not null,
   ID_CLIENTE           int                  not null,
   VALOR_CONTACTO       text                 not null,
   TIPO_CONTACTO        int                  not null,
   constraint PK_CONTACTOS primary key (ID_CONTACTO),
   constraint FK_CONTACTO_CONTACTOS_CLIENTES foreign key (ID_CLIENTE)
      references CLIENTES (ID_CLIENTE)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Cliente = require("./Cliente.js");

const Contacto = sequelize.define(
	"contactos",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_CONTACTO",
			allowNull: false,
			autoIncrement: true,
		},
		idCliente: {
			type: DataTypes.INTEGER,
			field: "ID_CLIENTE",
			allowNull: false,
			// references: {
			// 	model: "clientes",
			// 	key: "id",
			// },
		},
		value: {
			type: DataTypes.STRING,
			field: "VALOR_CONTACTO",
			allowNull: false,
		},
		type: {
			type: DataTypes.INTEGER,
			field: "TIPO_CONTACTO",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

Contacto.belongsTo(Cliente, { foreignKey: "idCliente" });

module.exports = Contacto;
