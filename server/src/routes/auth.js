const { Router } = require("express");
const passport = require("passport");
const { register, logout, user, email } = require("../controllers/auth.controller.js");

const authRouter = Router()
	.get("/auth", passport.authenticate("local"))
	.post("/auth/email", email)
	.get("/auth/user", user)

	.post("/auth/register", register)
	.get("/auth/logout", logout)

	.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }))
	.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
		res.redirect(process.env.WEB_URL);
	})

	.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))
	.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
		res.redirect(process.env.WEB_URL);
	});

module.exports = authRouter;
