/*
create table UTILIZADORES (
   ID_USER              int                  not null,
   ID_TIPO_USER         int                  not null,
   NOME_USER            text                 not null,
   EMAIL                text                 not null,
   PASSWORD             text                 not null,
   HAS_CONFIRMED        bit                  not null,
   CV                   text                 null,
   NOVA_PASSWORD_CODE   text                 null,
   NOVA_PASSWORD_DATA   datetime             null,
   CONFIRM_CODE         text                 null,
   CONFIRM_DATE_START   datetime             null,
   ULTIMA_DATA_LOGIN    datetime             null,
	 ACTIVE_ACCOUNT       bit                  not null,
   constraint PK_UTILIZADORES primary key (ID_USER),
   constraint FK_UTILIZAD_UTILIZADO_TIPOS_DE foreign key (ID_TIPO_USER)
      references TIPOS_DE_UTILIZADOR (ID_TIPO_USER)
)
*/

const { DataTypes } = require("sequelize");
const sequelize = require("../connection.js");
const TipoUtilizador = require("./TipoUtilizador.js");

const Utilizador = sequelize.define(
	"utilizadores",
	{
		id: {
			type: DataTypes.INTEGER,
			primaryKey: true,
			field: "ID_USER",
			allowNull: false,
			autoIncrement: true,
		},
		idTipoUser: {
			type: DataTypes.INTEGER,
			field: "ID_TIPO_USER",
			allowNull: false,
			defaultValue: 1,
			// references: {
			// 	model: "tipos_de_utilizador",
			// 	key: "id",
			// },
		},
		name: {
			type: DataTypes.STRING,
			field: "NOME_USER",
			allowNull: false,
		},
		email: {
			type: DataTypes.STRING,
			field: "EMAIL",
			allowNull: false,
			unique: true,
		},
		hashedPassword: {
			type: DataTypes.STRING,
			field: "PASSWORD",
			allowNull: false,
		},
		hasConfirmed: {
			type: DataTypes.BOOLEAN,
			field: "HAS_CONFIRMED",
			allowNull: false,
			defaultValue: false,
		},
		socialUserId: {
			type: DataTypes.STRING,
			field: "SOCIAL_USER_ID",
		},
		registrationType: {
			type: DataTypes.ENUM("email", "google", "facebook"),
			field: "REGISTRATION_TYPE",
			defaultValue: "email",
		},
		cv: {
			type: DataTypes.STRING,
			field: "CV",
		},
		newPasswordCode: {
			type: DataTypes.STRING,
			field: "NOVA_PASSWORD_CODE",
		},
		newPasswordDate: {
			type: DataTypes.DATE,
			field: "NOVA_PASSWORD_DATA",
		},
		confirmCode: {
			type: DataTypes.STRING,
			field: "CONFIRM_CODE",
		},
		confirmDateStart: {
			type: DataTypes.DATE,
			field: "CONFIRM_DATE_START",
		},
		confirmRetries: {
			type: DataTypes.INTEGER,
			field: "CONFIRM_RETRIES",
			defaultValue: 0,
		},
		lastLoginDate: {
			type: DataTypes.DATE,
			field: "ULTIMA_DATA_LOGIN",
			defaultValue: DataTypes.NOW,
		},
		createdAt: {
			type: DataTypes.DATE,
			field: "DATA_CRIACAO",
			allowNull: false,
			defaultValue: DataTypes.NOW,
		},
		disabled: {
			type: DataTypes.BOOLEAN,
			field: "ACTIVE_ACCOUNT",
			allowNull: false,
			defaultValue: false,
		},
		disabledBy: {
			type: DataTypes.INTEGER,
			field: "DISABLED_BY",
		},
		disabledAt: {
			type: DataTypes.DATE,
			field: "DISABLED_AT",
		},
	},
	{ timestamps: false },
);

Utilizador.hasOne(TipoUtilizador, { foreignKey: "id", sourceKey: "idTipoUser", as: "tipoUtilizador" });

module.exports = Utilizador;
