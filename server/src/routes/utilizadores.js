const { Router } = require("express");
const { read, update, disableAccount } = require("../controllers/utilizadores.controller.js");

const utilizadoresRouter = Router() //
	.get("/", read)
	.patch("/:id", update)
	.patch("/:id/disable", disableAccount);

module.exports = utilizadoresRouter;
