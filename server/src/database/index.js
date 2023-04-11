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

Utilizador.hasMany(Ideia);
Ideia.belongsTo(Utilizador, { as: "user", foreignKey: "idUser" });

Utilizador.hasOne(TipoUtilizador, { as: "tipo", foreignKey: "idTipoUser" });
TipoUtilizador.hasMany(Utilizador, { as: "user", foreignKey: "idTipoUser" });

Utilizador.hasMany(Ideia, { as: "validator", foreignKey: "validatorId" });
Ideia.belongsTo(Utilizador, { as: "validator", foreignKey: "validatorId" });

Utilizador.hasMany(Beneficio);
Beneficio.belongsTo(Utilizador, { as: "user", foreignKey: "idUser" });

Candidatura.belongsTo(Utilizador, { as: "user", foreignKey: "idUser" });
Utilizador.hasMany(Candidatura, { as: "candidaturas", foreignKey: "idUser" });
Candidatura.hasOne(Vaga, { as: "vaga", foreignKey: "idVaga" });
Vaga.hasMany(Candidatura, { as: "candidaturas", foreignKey: "idVaga" });

Cliente.hasMany(Contacto);
Contacto.belongsTo(Cliente, { as: "client", foreignKey: "idClient" });

Negocio.belongsTo(Utilizador, { as: "user", foreignKey: "idUser" });
Utilizador.hasMany(Negocio, { as: "negocios", foreignKey: "idUser" });
Negocio.hasOne(Utilizador, { as: "funcionario", foreignKey: "idFuncionarioResponsavel" });
AreaNegocio.hasMany(Negocio, { as: "negocios", foreignKey: "idAreaNegocio" });
Negocio.hasOne(AreaNegocio, { as: "area", foreignKey: "idAreaNegocio" });
Negocio.hasOne(CentroTrabalho, { as: "centro", foreignKey: "idCentroTrabalho" });
CentroTrabalho.hasMany(Negocio, { as: "negocios", foreignKey: "idCentroTrabalho" });
Negocio.hasMany(ContactoNegocio, { as: "contactos", foreignKey: "idNegocio" });
ContactoNegocio.belongsTo(Negocio, { as: "negocio", foreignKey: "idNegocio" });
Negocio.hasOne(EstadoNegocio, { as: "estados", foreignKey: "idNegocio" });
EstadoNegocio.belongsTo(Negocio, { as: "negocio", foreignKey: "idNegocio" });
Negocio.hasMany(NecessidadeNegocio, { as: "necessidades", foreignKey: "idNegocio" });
NecessidadeNegocio.belongsTo(Negocio, { as: "negocio", foreignKey: "idNegocio" });

Notificacao.belongsTo(Utilizador, { as: "user", foreignKey: "idUser" });
Utilizador.hasMany(Notificacao, { as: "notificacoes", foreignKey: "idUser" });
Notificacao.hasOne(TipoNotificacao, { as: "tipo", foreignKey: "idTipoNotificacao" });
TipoNotificacao.hasMany(Notificacao, { as: "notificacoes", foreignKey: "idTipoNotificacao" });

Utilizador.belongsToMany(Reuniao, { through: "ReunioesUser" });
Reuniao.belongsToMany(Utilizador, { through: "ReunioesUser" });

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
};
