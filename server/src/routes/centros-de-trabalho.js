const { Router } = require("express");
const { read } = require("../controllers/centros-de-trabalho.controller.js");

const centrosDeTrabalhoRouter = Router() //
	.get("/", read);

module.exports = centrosDeTrabalhoRouter;
