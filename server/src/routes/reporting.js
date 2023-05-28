const { Router } = require("express");
const {
	candidaturas,
	negocios,
	utilizadores,
	beneficios,
	ideias,
	vagas,
	negociosPorMes,
	volumeNegociosPorEstado,
} = require("../controllers/reporting.controller.js");

const reportingRouter = Router()
	.get("/beneficios", beneficios)
	.get("/candidaturas", candidaturas)
	.get("/ideias", ideias)
	.get("/negocios", negocios)
	.get("/utilizadores", utilizadores)
	.get("/vagas", vagas)
	.get("/negocios/mes", negociosPorMes)
	.get("/negocios/volume-estados", volumeNegociosPorEstado);

module.exports = reportingRouter;
