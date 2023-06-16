const { Router } = require("express");
const { create, read, destroy } = require("../controllers/areas-de-negocio.controller.js");

const areasDeNegocioRouter = Router() //
	.get("/", read)
	.post("/", create)
	.delete("/:id", destroy);

module.exports = areasDeNegocioRouter;
