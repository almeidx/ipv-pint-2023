const { Router } = require("express");
const { read } = require("../controllers/tipos-utilizador.controller.js");

const tiposUtilizadorRouter = Router() //
	.get("/", read);

module.exports = tiposUtilizadorRouter;
