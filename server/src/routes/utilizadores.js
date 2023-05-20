const { Router } = require("express");
const { read, update, disableAccount } = require("../controllers/utilizadores.controller.js");
const { update: updateMe } = require("../controllers/me.controller.js");

const utilizadoresRouter = Router()
	.get("/", read)
	.patch("/@me", updateMe)
	.patch("/:id", update)
	.patch("/:id/disable", disableAccount);

module.exports = utilizadoresRouter;
