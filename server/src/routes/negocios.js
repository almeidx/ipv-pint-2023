const { Router } = require("express");
const { read } = require("../controllers/negocios.controller.js");

const negociosRouter = Router() //
	.get("/", read);

module.exports = negociosRouter;
