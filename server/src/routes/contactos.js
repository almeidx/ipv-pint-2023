const { Router } = require("express");
const { read } = require("../controllers/vagas.controller.js");

const contactosRouter = Router() //
	.get("/", read);

module.exports = contactosRouter;
