const { Utilizador } = require("../database/index.js");
const bcrypt = require("bcrypt");
const passport = require("passport");

/**
 * @type {Record<string, (req: import("express").Request, res: import("express").Response, next: import("express").NextFunction) => Promise<void> | void}
 */
module.exports = {
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

	user(req, res) {
		if (!req.user) {
			res.status(401).json({ message: "Não tem sessão iniciada" });
			return;
		}

		res.json({ cookie: req.cookies["connect.sid"], user: req.user });
	},

	logout(req, res) {
		if (!req.user) {
			res.redirect(process.env.WEB_URL);
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

	async register(req, res, next) {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			res.status(400).json({ message: "Invalid request" });
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
};
