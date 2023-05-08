const { Router } = require("express");
const { candidaturas, negocios, utilizadores } = require("../controllers/reporting.controller.js");

const reportingRouter = Router()
	.get("/candidaturas", candidaturas)
	.get("/negocios", negocios)
	.get("/utilizadores", utilizadores);

module.exports = reportingRouter;
