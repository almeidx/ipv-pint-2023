const { Router } = require("express");
const { read, concluir } = require("../controllers/candidaturas.controller.js");

const candidaturasRouter = Router() //
	.get("/", read)
	.post("/:id/concluir", concluir);

module.exports = candidaturasRouter;
