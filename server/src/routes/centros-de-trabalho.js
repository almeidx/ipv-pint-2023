const { Router } = require("express");
const { create, read, destroy } = require("../controllers/centros-de-trabalho.controller.js");

const centrosDeTrabalhoRouter = Router() //
	.get("/", read)
	.post("/", create)
	.delete("/:id", destroy);

module.exports = centrosDeTrabalhoRouter;
