const { Router } = require("express");
const { read, update, seenAll } = require("../controllers/notificacoes.controller.js");

const notificacoesRouter = Router() //
	.get("/", read)
	.patch("/:id", update)
	.post("/seen-all", seenAll);

module.exports = notificacoesRouter;
