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
	googleCallbackMobile,
	facebook,
	facebookCallback,
	facebookCallbackMobile,
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
	.post("/facebook/callback/mobile", facebookCallbackMobile)

	.get("/google", google)
	.get("/google/callback", googleCallback)
	.post("/google/callback/mobile", googleCallbackMobile);

module.exports = authRouter;
