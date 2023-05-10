const { Router } = require("express");
const { create, read, update, destroy } = require("../controllers/beneficios.controller.js");

const beneficiosRouter = Router() //
	.get("/", read)
	.post("/", create)
	.patch("/:id", update)
	.delete("/:id", destroy);

module.exports = beneficiosRouter;
