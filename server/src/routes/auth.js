const { Router } = require("express");
const {
	auth,
	register,
	logout,
	user,
	email,
	google,
	googleCallback,
	facebook,
	facebookCallback,
} = require("../controllers/auth.controller.js");

const authRouter = Router()
	.get("/auth", auth)
	.post("/auth/email", email)
	.get("/auth/user", user)

	.post("/auth/register", register)
	.get("/auth/logout", logout)

	.get("/auth/facebook", facebook)
	.get("/auth/facebook/callback", facebookCallback)

	.get("/auth/google", google)
	.get("/auth/google/callback", googleCallback);

module.exports = authRouter;
