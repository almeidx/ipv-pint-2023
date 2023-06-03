const { Router } = require("express");
const {
	read,
	update,
	disableAccount,
	esqueceuPasswordRequest,
	esqueceuPasswordUpdate,
} = require("../controllers/utilizadores.controller.js");
const { update: updateMe, updatePassword: updatePasswordMe } = require("../controllers/me.controller.js");

const utilizadoresRouter = Router()
	.get("/", read)
	.patch("/@me", updateMe)
	.patch("/@me/password", updatePasswordMe)
	.patch("/:id", update)
	.post("/esqueceu-password", esqueceuPasswordRequest)
	.patch("/:id/esqueceu-password", esqueceuPasswordUpdate)
	.patch("/:id/disable", disableAccount);

module.exports = utilizadoresRouter;
