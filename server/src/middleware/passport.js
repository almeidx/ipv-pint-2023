const bcrypt = require("bcrypt");
const { Utilizador, TipoUtilizador } = require("../database/index.js");
const LocalStrategy = require("passport-local").Strategy;

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (user, done) {
		done(null, user);
	});

	passport.use(
		new LocalStrategy(
			{
				usernameField: "email",
				passwordField: "password",
				session: true,
			},
			async function (username, password, done) {
				const user = await Utilizador.findOne({
					where: { email: username },
					attributes: ["id", "name", "email", "hashedPassword"],
					include: [
						{
							model: TipoUtilizador,
							attributes: ["id", "name"],
							as: "tipoUtilizador",
						},
					],
				});

				if (!user) {
					return done(null, false);
				}

				const userObj = user.toJSON();

				const passwordMatches = await bcrypt.compare(password, userObj.hashedPassword);

				if (passwordMatches) {
					const { hashedPassword, ...userWithoutPassword } = userObj;

					return done(null, userWithoutPassword);
				} else {
					return done(null, false);
				}
			},
		),
	);
};
