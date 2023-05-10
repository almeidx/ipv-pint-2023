const { Router } = require("express");
const { read } = require("../controllers/reunioes.controller.js");

const reunioesRouter = Router() //
	.get("/", read);

module.exports = reunioesRouter;
