const { Router } = require("express");
const { create, read, update } = require("../controllers/vagas.controller.js");
const { create: candidatarVaga } = require("../controllers/candidaturas.controller.js");

const vagasRouter = Router()
	.get("/", read)
	.post("/", create)
	.post("/:id/candidatar", candidatarVaga)
	.patch("/:id", update);

module.exports = vagasRouter;
