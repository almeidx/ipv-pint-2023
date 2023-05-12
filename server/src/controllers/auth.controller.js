const bcrypt = require("bcrypt");
const { body } = require("express-validator");
const passport = require("passport");
const { Utilizador } = require("../database/index.js");
const { requireLogin } = require("../middleware/authentication.js");
const { validate } = require("../middleware/validation.js");

/**
 * @type {Record<string, ((req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void> | void)|[...(import("express").RequestHandler), (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void> | void]>}
 */
module.exports = {
	auth: [passport.authenticate("local")],

	email(req, res, next) {
		passport.authenticate("local", (err, user, info) => {
			if (err) {
				return next(err);
			}

			if (!user) {
				res.status(401).json({ message: "Credenciais inválidas" });
				return;
			}

			req.logIn(user, function (err) {
				if (err) {
					return next(err);
				}

				res.json({ user: req.user });
			});
		})(req, res, next);
	},

	user: [
		requireLogin(),
		(req, res) => {
			res.json({ cookie: req.cookies["connect.sid"], user: req.user });
		},
	],

	logout(req, res) {
		if (!req.user) {
			res.redirect(process.env.WEB_URL);
			return;
		}

		req.logout((err) => {
			if (err) {
				console.error(err);
				res.status(500).json({ message: "Não foi possível iniciar a sessão" });
				return;
			}

			res.redirect(process.env.WEB_URL);
		});
	},

	register: [
		validate(
			body("name", "`name` tem que ser do tipo string ").isString().isLength({ min: 1, max: 100 }),
			body("email", "`email` tem que ser um email").isEmail(),
			body("password", "`password` tem que ser do tipo string e ter entre 12 e 100 caracteres")
				.isString()
				.isLength({ min: 1, max: 100 }),
		),

		async (req, res, next) => {
			const { name, email, password } = req.body;

			const hashedPassword = await bcrypt.hash(password, 10);

			await Utilizador.create({ name, email, hashedPassword });

			passport.authenticate("local", function (err, user) {
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

					return res.json({ user: req.user });
				});
			})(req, res, next);
		},
	],

	google: [passport.authenticate("google", { scope: ["profile", "email"] })],
	googleCallback: [
		passport.authenticate("google", { failureRedirect: process.env.WEB_URL + "/login" }),
		(_req, res) => {
			res.redirect(process.env.WEB_URL);
		},
	],

	facebook: [passport.authenticate("facebook", { scope: ["email"] })],
	facebookCallback: [
		passport.authenticate("facebook", { failureRedirect: process.env.WEB_URL + "/login" }),
		(_req, res) => {
			res.redirect(process.env.WEB_URL);
		},
	],
};
