const { Router } = require("express");
const { read } = require("../controllers/areas-de-negocio.controller.js");

const areasDeNegocioRouter = Router() //
	.get("/", read);

module.exports = areasDeNegocioRouter;
