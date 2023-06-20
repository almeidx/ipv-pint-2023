const { Router } = require("express");
const { create, read, destroy } = require("../controllers/tipos-de-projeto.controller.js");

const tiposDeProjetoRouter = Router() //
	.get("/", read)
	.post("/", create)
	.delete("/:id", destroy);

module.exports = tiposDeProjetoRouter;
