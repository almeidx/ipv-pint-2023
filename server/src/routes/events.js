const { read } = require("../controllers/events.controller.js")
const { Router } = require("express");

const eventsRouter = Router() //
	.get("/", read);

module.exports = eventsRouter;
