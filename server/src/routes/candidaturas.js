const { Router } = require("express");
const { read } = require("../controllers/candidaturas.controller.js");

const candidaturasRouter = Router() //
	.get("/", read);

module.exports = candidaturasRouter;
