/*
create table NEGOCIOS (
   ID_OPORTUNIDADE      int                  not null,
   ID_AREA_NEGOCIO      int                  not null,
   ID_USER              int                  not null,
   UTI_ID_USER          int                  not null,
   ID_CLIENTE           int                  not null,
   ID_CENTRO_TRABALHO   int                  not null,
   DESCRICAO_OPORTUNIDADE text               not null,
   TITULO_OPORTUNIDADE  text                 not null,
   ESTADO_ATUAL         int                  not null,
   constraint PK_NEGOCIOS primary key (ID_OPORTUNIDADE),
   constraint FK_NEGOCIOS_OPORTUNID_UTILIZAD foreign key (UTI_ID_USER)
      references UTILIZADORES (ID_USER),
   constraint FK_NEGOCIOS_NEGOCIOS__CLIENTES foreign key (ID_CLIENTE)
      references CLIENTES (ID_CLIENTE),
   constraint FK_NEGOCIOS_NEGOCIOS__AREA_DE_ foreign key (ID_AREA_NEGOCIO)
      references AREA_DE_NEGOCIO (ID_AREA_NEGOCIO),
   constraint FK_NEGOCIOS_COLABORAD_UTILIZAD foreign key (ID_USER)
      references UTILIZADORES (ID_USER),
   constraint FK_NEGOCIOS_CENTRO_DE_CENTROS_ foreign key (ID_CENTRO_TRABALHO)
      references CENTROS_DE_TRABALHO (ID_CENTRO_TRABALHO)
)
 */

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const AreaNegocio = require("./AreaNegocio.js");
const CentroTrabalho = require("./CentroTrabalho.js");
const Cliente = require("./Cliente.js");
const Utilizador = require("./Utilizador.js");

const Negocio = sequelize.define(
	"negocios",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_OPORTUNIDADE",
			allowNull: false,
			autoIncrement: true,
		},
		idAreaNegocio: {
			type: DataTypes.INTEGER,
			field: "ID_AREA_NEGOCIO",
			allowNull: false,
			// references: {
			// 	model: "area_de_negocio",
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
		idFuncionarioResponsavel: {
			type: DataTypes.INTEGER,
			field: "UTI_ID_USER",
			// references: {
			// 	model: "utilizadores",
			// 	key: "id",
			// },
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
		idCentroTrabalho: {
			type: DataTypes.INTEGER,
			field: "ID_CENTRO_TRABALHO",
			// references: {
			// 	model: "centros_de_trabalho",
			// 	key: "id",
			// },
		},
		description: {
			type: DataTypes.STRING(1_000),
			field: "DESCRICAO_OPORTUNIDADE",
			allowNull: false,
		},
		title: {
			type: DataTypes.STRING,
			field: "TITULO_OPORTUNIDADE",
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO",
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
	},
	{ timestamps: false },
);

Negocio.hasOne(AreaNegocio, { sourceKey: "idAreaNegocio", foreignKey: "id", as: "areaNegocio" });
Negocio.belongsTo(Cliente, { foreignKey: "idCliente", as: "cliente" });
Negocio.hasOne(CentroTrabalho, { sourceKey: "idCentroTrabalho", foreignKey: "id", as: "centroTrabalho" });

Negocio.hasOne(Utilizador, { sourceKey: "idUser", foreignKey: "id", as: "criador" });
Negocio.hasOne(Utilizador, { sourceKey: "idFuncionarioResponsavel", foreignKey: "id", as: "funcionarioResponsavel" });

module.exports = Negocio;
