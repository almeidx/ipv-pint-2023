const { Router } = require("express");
const { create, read, destroy } = require("../controllers/mensagens.controller.js");

const mensagensRouter = Router() //
	.get("/", read)
	.post("/", create)
	.delete("/:id", destroy);

module.exports = mensagensRouter;
