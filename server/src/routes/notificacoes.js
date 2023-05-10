const { Router } = require("express");
const { read } = require("../controllers/notificacoes.controller.js");

const notificacoesRouter = Router() //
	.get("/", read);

module.exports = notificacoesRouter;
