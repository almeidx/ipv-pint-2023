const sequelize = require("./connection.js");

const AreaNegocio = require("./model/AreaNegocio.js");
const Beneficio = require("./model/Beneficio.js");
const Candidatura = require("./model/Candidatura.js");
const CentroTrabalho = require("./model/CentroTrabalho.js");
const Cliente = require("./model/Cliente.js");
const Contacto = require("./model/Contacto.js");
const ContactoNegocio = require("./model/ContactoNegocio.js");
const EstadoNegocio = require("./model/EstadoNegocio.js");
const Ideia = require("./model/Ideia.js");
const Mensagem = require("./model/Mensagem.js");
const NecessidadeNegocio = require("./model/NecessidadeNegocio.js");
const Negocio = require("./model/Negocio.js");
const NotaEntrevista = require("./model/NotaEntrevista.js");
const Notificacao = require("./model/Notificacao.js");
const Reuniao = require("./model/Reuniao.js");
const TipoNotificacao = require("./model/TipoNotificacao.js");
const TipoUtilizador = require("./model/TipoUtilizador.js");
const Utilizador = require("./model/Utilizador.js");
const Vaga = require("./model/Vaga.js");

// Estas relações têm que estar definidas aqui devido a um import cíclico
Negocio.hasMany(ContactoNegocio, { sourceKey: "id", foreignKey: "idNegocio", as: "contactos" });
Negocio.hasMany(EstadoNegocio, { sourceKey: "id", foreignKey: "idNegocio", as: "estados" });

Mensagem.hasOne(Utilizador, { sourceKey: "idCriador", foreignKey: "id", as: "criador", constraints: false });
Utilizador.hasMany(Mensagem, { sourceKey: "id", foreignKey: "idCriador", as: "mensagens" });

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
	Mensagem,
	NecessidadeNegocio,
	Negocio,
	NotaEntrevista,
	Notificacao,
	Reuniao,
	TipoNotificacao,
	TipoUtilizador,
	Utilizador,
	Vaga,
};

/**
 * @typedef {Object} Controller
 * @property {(req: import("express").Request, res: import("express").Response) => Promise<void>} create
 * @property {(req: import("express").Request, res: import("express").Response) => Promise<void>} read
 * @property {(req: import("express").Request, res: import("express").Response) => Promise<void>} update
 * @property {(req: import("express").Request, res: import("express").Response) => Promise<void>} delete_
 */
