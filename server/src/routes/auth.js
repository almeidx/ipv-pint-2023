const { Router } = require("express");
const { Utilizador } = require("../database/index.js");
const bcrypt = require("bcrypt");
const passport = require("passport");

const authRouter = Router()
	.get("/auth", passport.authenticate("local"))
	.post("/auth/email", async (req, res, next) => {
		passport.authenticate("local", (err, user, info) => {
			if (err) {
				return next(err);
			}

			if (!user) {
				res.status(401).json({
					message: "Invalid credentials",
				});
				return;
			}

			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}

				res.json({ user: req.user });
			});
		})(req, res, next);
	})

	.get("/auth/user", (req, res) => {
		if (!req.user) {
			res.status(401).json({
				message: "Not logged in",
			});
			return;
		}

		res.json({
			cookie: req.cookies["connect.sid"],
			user: req.user,
		});
	})

	.get("/auth/logout", (req, res) => {
		if (req.user) {
			req.logout((err) => {
				if (err) {
					console.error(err);
					res.status(500).json({
						message: "Failed to log out",
					});
					return;
				}

				res.redirect(process.env.WEB_URL);
			});
		} else {
			res.redirect(process.env.WEB_URL);
		}
	})
	.post("/auth/register", async (req, res, next) => {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			res.status(400).json({
				message: "Invalid request",
			});
			return;
		}

		const hash = await bcrypt.hash(password, 10);

		await Utilizador.create({
			name,
			email,
			hashedPassword: hash,
			salt: "",
			hasConfirmed: false,
			activeAccount: true,
			idTipoUser: 1,
		});

		passport.authenticate("local", function (err, user, info) {
			if (err) {
				return next(err);
			}

			if (!user) {
				return res.redirect("/auth/user");
			}

			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}

				return res.json({
					user: req.user,
				});
			});
		})(req, res, next);
	})

	.get("/auth/facebook", passport.authenticate("facebook", { scope: ["email"] }))
	.get("/auth/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/login" }), (req, res) => {
		res.redirect(process.env.WEB_URL);
	})

	.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }))
	.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login" }), (req, res) => {
		res.redirect(process.env.WEB_URL);
	});

module.exports = authRouter;
