const { Router } = require("express");
const {
	auth,
	register,
	validarConta,
	retryValidar,
	logout,
	user,
	email,
	google,
	googleCallback,
	facebook,
	facebookCallback,
} = require("../controllers/auth.controller.js");

const authRouter = Router()
	.get("/", auth)
	.post("/email", email)
	.get("/user", user)

	.post("/register", register)
	.post("/validate", validarConta)
	.post("/validate/retry", retryValidar)
	.get("/logout", logout)

	.get("/facebook", facebook)
	.get("/facebook/callback", facebookCallback)

	.get("/google", google)
	.get("/google/callback", googleCallback);

module.exports = authRouter;
