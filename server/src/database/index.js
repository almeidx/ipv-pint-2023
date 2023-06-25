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
const TipoProjeto = require("./model/TipoProjeto.js");
const TipoUtilizador = require("./model/TipoUtilizador.js");
const Utilizador = require("./model/Utilizador.js");
const Vaga = require("./model/Vaga.js");

// Estas relações têm que estar definidas aqui devido a um import cíclico
Negocio.hasMany(ContactoNegocio, { sourceKey: "id", foreignKey: "idNegocio", as: "contactos" });
Negocio.hasMany(EstadoNegocio, { sourceKey: "id", foreignKey: "idNegocio", as: "estados" });

NecessidadeNegocio.belongsTo(Negocio, { foreignKey: "idNegocio", as: "negocio" });
Negocio.hasMany(NecessidadeNegocio, { foreignKey: "idNegocio", as: "necessidades" });

Negocio.hasOne(AreaNegocio, { sourceKey: "idAreaNegocio", foreignKey: "id", as: "areaNegocio" });
AreaNegocio.hasMany(Negocio, { sourceKey: "id", foreignKey: "idAreaNegocio", as: "negocios" });

Negocio.hasOne(TipoProjeto, { sourceKey: "idTipoProjeto", foreignKey: "id", as: "tipoProjeto" });
TipoProjeto.hasMany(Negocio, { sourceKey: "id", foreignKey: "idTipoProjeto", as: "negocios" });

Negocio.hasOne(CentroTrabalho, { sourceKey: "idCentroTrabalho", foreignKey: "id", as: "centroTrabalho" });
CentroTrabalho.hasMany(Negocio, { sourceKey: "id", foreignKey: "idCentroTrabalho", as: "negocios" });

Mensagem.hasOne(Utilizador, { sourceKey: "idCriador", foreignKey: "id", as: "criador", constraints: false });
Utilizador.hasMany(Mensagem, { sourceKey: "id", foreignKey: "idCriador", as: "mensagens" });

Reuniao.belongsToMany(Utilizador, {
	through: "reunioes_utilizadores",
	foreignKey: "idReuniao",
	otherKey: "idUtilizador",
	timestamps: false,
});
Utilizador.belongsToMany(Reuniao, {
	through: "reunioes_utilizadores",
	foreignKey: "idUtilizador",
	otherKey: "idReuniao",
	timestamps: false,
});

NotaEntrevista.belongsTo(Reuniao, { foreignKey: "idReuniao" });
Reuniao.hasMany(NotaEntrevista, { foreignKey: "idReuniao" });

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
	TipoProjeto,
	TipoUtilizador,
	Utilizador,
	Vaga,
};

/**
 * @typedef {Object} Controller
 * @property {((req: import("express").Request, res: import("express").Response) => Promise<void> | void)|[...(import("express").RequestHandler), (req: import("express").Request, res: import("express").Response) => Promise<void> | void]} create
 * @property {((req: import("express").Request, res: import("express").Response) => Promise<void> | void)|[...(import("express").RequestHandler), (req: import("express").Request, res: import("express").Response) => Promise<void> | void]} read
 * @property {((req: import("express").Request, res: import("express").Response) => Promise<void> | void)|[...(import("express").RequestHandler), (req: import("express").Request, res: import("express").Response) => Promise<void> | void]} update
 * @property {((req: import("express").Request, res: import("express").Response) => Promise<void> | void)|[...(import("express").RequestHandler), (req: import("express").Request, res: import("express").Response) => Promise<void> | void]} destroy
 */
