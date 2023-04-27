const sequelize = require("./connection.js");

const AreaNegocio = require("./model/AreaNegocio.js");
const TipoUtilizador = require("./model/TipoUtilizador.js");
const Ideia = require("./model/Ideia.js");
const Utilizador = require("./model/Utilizador.js");
const Beneficio = require("./model/Beneficio.js");
const Vaga = require("./model/Vaga.js");
const Candidatura = require("./model/Candidatura.js");
const CentroTrabalho = require("./model/CentroTrabalho.js");
const Cliente = require("./model/Cliente.js");
const Contacto = require("./model/Contacto.js");
const Negocio = require("./model/Negocio.js");
const ContactoNegocio = require("./model/ContactoNegocio.js");
const EstadoNegocio = require("./model/EstadoNegocio.js");
const NecessidadeNegocio = require("./model/NecessidadeNegocio.js");
const TipoNotificacao = require("./model/TipoNotificacao.js");
const Notificacao = require("./model/Notificacao.js");
const Reuniao = require("./model/Reuniao.js");
const NotaEntrevista = require("./model/NotaEntrevista.js");

// Estas relações têm que estar definidas aqui devido a um import cíclico
Negocio.hasMany(ContactoNegocio, { sourceKey: "id", foreignKey: "idNegocio", as: "contactos" });
Negocio.hasMany(EstadoNegocio, { sourceKey: "id", foreignKey: "idNegocio", as: "estados" });

module.exports = {
	sequelize,
	AreaNegocio,
	Beneficio,
	Candidatura,
	CentroTrabalho,
	Cliente,
	Contacto,
	ContactoNegocio,
	EstadoNegocio,
	Ideia,
	NecessidadeNegocio,
	Negocio,
	TipoUtilizador,
	Utilizador,
	Vaga,
	TipoNotificacao,
	Notificacao,
	Reuniao,
	NotaEntrevista,
};

/**
 * @typedef {Object} Controller
 * @property {(req: import("express").Request, res: import("express").Response) => Promise<void>} create
 * @property {(req: import("express").Request, res: import("express").Response) => Promise<void>} read
 * @property {(req: import("express").Request, res: import("express").Response) => Promise<void>} update
 * @property {(req: import("express").Request, res: import("express").Response) => Promise<void>} delete
 */
