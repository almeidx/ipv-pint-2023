/*
create table NOTIFICACOES (
   ID_NOTIFICACAO       int                  not null,
   ID_USER              int                  not null,
   ID_REUNIAO           int                  null,
   CONTEUDO_NOTIFICACAO text                 not null,
   VISTA                bit                  not null,
   DATA_CRIACAO_NOTIFICACAO datetime         not null,
   TIPO_NOTIFICACAO     int                  not null,
   DATA_ADICIONAL       datetime             null,
   constraint PK_NOTIFICACOES primary key (ID_NOTIFICACAO),
   constraint FK_NOTIFICA_NOTIFICAC_UTILIZAD foreign key (ID_USER)
      references UTILIZADORES (ID_USER),
   constraint FK_NOTIFICA_NOTIFICAC_REUNIOES foreign key (ID_REUNIAO)
      references REUNIOES (ID_REUNIAO)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const Utilizador = require("./Utilizador.js");
const Reuniao = require("./Reuniao.js");

const Notificacao = sequelize.define(
	"notificacoes",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_NOTIFICACAO",
			allowNull: false,
			autoIncrement: true,
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
		idReuniao: {
			type: DataTypes.INTEGER,
			field: "ID_REUNIAO",
			// references: {
			// 	model: "reunioes",
			// 	key: "id",
			// },
		},
		content: {
			type: DataTypes.TEXT,
			field: "CONTEUDO_NOTIFICACAO",
			allowNull: false,
		},
		seen: {
			type: DataTypes.BOOLEAN,
			field: "VISTA",
			allowNull: false,
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO_NOTIFICACAO",
			allowNull: false,
		},
		type: {
			type: DataTypes.INTEGER,
			field: "TIPO_NOTIFICACAO",
			allowNull: false,
		},
		additionalDate: {
			type: DataTypes.DATE,
			field: "DATA_ADICIONAL",
		},
	},
	{ timestamps: false },
);

Notificacao.belongsTo(Utilizador, { foreignKey: "idUser" });
Notificacao.hasOne(Reuniao, { sourceKey: "idReuniao", foreignKey: "id" });

module.exports = Notificacao;
