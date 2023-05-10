const { Router } = require("express");
const { create, read, update, destroy } = require("../controllers/ideias.controller.js");

const ideiasRouter = Router() //
	.get("/", read)
	.post("/", create)
	.patch("/:id", update)
	.delete("/:id", destroy);

module.exports = ideiasRouter;
