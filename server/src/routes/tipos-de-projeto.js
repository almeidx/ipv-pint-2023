const { Router } = require("express");
const { read } = require("../controllers/tipos-de-projeto.controller.js");

const tiposDeProjetoRouter = Router() //
	.get("/", read);

module.exports = tiposDeProjetoRouter;
