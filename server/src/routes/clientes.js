const { Router } = require("express");
const { read } = require("../controllers/clientes.controller.js");

const clientesRouter = Router() //
	.get("/", read);

module.exports = clientesRouter;
