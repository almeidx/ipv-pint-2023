const { Router } = require("express");
const { create, read } = require("../controllers/reunioes.controller.js");

const reunioesRouter = Router() //
	.get("/", read)
	.post("/", create);

module.exports = reunioesRouter;
