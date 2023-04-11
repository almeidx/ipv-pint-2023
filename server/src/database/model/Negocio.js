/*
create table NEGOCIOS (
   ID_OPORTUNIDADE      int                  not null,
   ID_AREA_NEGOCIO      int                  not null,
   ID_USER              int                  not null,
   UTI_ID_USER          int                  not null,
   ID_CLIENTE           int                  not null,
   ID_CENTRO_TRABALHO   int                  not null,
   DESCRICAO_OPORTUNIDADE text                 not null,
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

module.exports = sequelize.define("negocios", {
	id: {
		type: DataTypes.INTEGER,
		primaryKey: true,
		field: "ID_OPORTUNIDADE",
	},
	idAreaNegocio: {
		type: DataTypes.INTEGER,
		field: "ID_AREA_NEGOCIO",
	},
	idUser: {
		type: DataTypes.INTEGER,
		field: "ID_USER",
	},
	idFuncionarioResponsavel: {
		type: DataTypes.INTEGER,
		field: "UTI_ID_USER",
	},
	idCliente: {
		type: DataTypes.INTEGER,
		field: "ID_CLIENTE",
	},
	idCentroTrabalho: {
		type: DataTypes.INTEGER,
		field: "ID_CENTRO_TRABALHO",
	},
	description: {
		type: DataTypes.STRING,
		field: "DESCRICAO_OPORTUNIDADE",
	},
	title: {
		type: DataTypes.STRING,
		field: "TITULO_OPORTUNIDADE",
	},
	status: {
		type: DataTypes.INTEGER,
		field: "ESTADO_ATUAL",
	},
});
