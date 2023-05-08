const { Router } = require("express");
const {
	candidaturas,
	negocios,
	utilizadores,
	beneficios,
	ideias,
	vagas,
	negociosChart: negociosPorMes,
} = require("../controllers/reporting.controller.js");

const reportingRouter = Router()
	.get("/beneficios", beneficios)
	.get("/candidaturas", candidaturas)
	.get("/ideias", ideias)
	.get("/negocios", negocios)
	.get("/utilizadores", utilizadores)
	.get("/vagas", vagas)
	.get("/negocios/chart", negociosPorMes);

module.exports = reportingRouter;
