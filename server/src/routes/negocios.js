const { Router } = require("express");
const { create, read, update } = require("../controllers/negocios.controller.js");

const negociosRouter = Router() //
	.get("/", read)
	.post("/", ...create)
	.patch("/:id", update);

module.exports = negociosRouter;
