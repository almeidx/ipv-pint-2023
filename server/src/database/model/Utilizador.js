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
const { crypto } = require("node:crypto");
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
		salt: {
			type: DataTypes.STRING,
			field: "SALT",
			allowNull: false,
		},
		hasConfirmed: {
			type: DataTypes.BOOLEAN,
			field: "HAS_CONFIRMED",
			allowNull: false,
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
		lastLoginDate: {
			type: DataTypes.DATE,
			field: "ULTIMA_DATA_LOGIN",
		},
		activeAccount: {
			type: DataTypes.BOOLEAN,
			field: "ACTIVE_ACCOUNT",
			allowNull: false,
		},
	},
	{ timestamps: false },
);

Utilizador.hasOne(TipoUtilizador, { foreignKey: "id", sourceKey: "idTipoUser", as: "tipoUtilizador" });

module.exports = Utilizador;

exports.makeSalt = function makeSalt() {
	return `${Math.round(new Date().valueOf() * Math.random())}`;
};

exports.encryptPassword = function encryptPassword(password, salt) {
	if (!password) return "";

	try {
		return crypto.createHmac("sha1", salt).update(password).digest("hex");
	} catch {
		return "";
	}
};

exports.authenticate = function authenticate(password, hashedPassword, salt) {
	return encryptPassword(password, salt) === hashedPassword;
};
