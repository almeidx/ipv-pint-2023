const bcrypt = require("bcrypt");
const { Utilizador, TipoUtilizador } = require("../database/index.js");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;

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
					attributes: ["id", "name", "email", "cv", "registrationType", "hashedPassword"],
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

					await Utilizador.update({ lastLoginDate: new Date() }, { where: { id: userWithoutPassword.id } });

					return done(null, userWithoutPassword);
				} else {
					return done(null, false);
				}
			},
		),
	);

	passport.use(
		new FacebookStrategy(
			{
				clientID: process.env.FACEBOOK_APP_ID,
				clientSecret: process.env.FACEBOOK_APP_SECRET,
				callbackURL: process.env.FACEBOOK_APP_CALLBACK_URL,
				profileFields: ["id", "name", "email"],
			},
			async function (_accessToken, _refreshToken, profile, cb) {
				let user = await Utilizador.findOne({
					where: {
						socialUserId: profile.id,
						registrationType: "facebook",
					},
					attributes: ["id", "name", "cv", "email", "registrationType"],
					include: [
						{
							model: TipoUtilizador,
							attributes: ["id", "name"],
							as: "tipoUtilizador",
						},
					],
				});

				if (!user) {
					user = await Utilizador.create(
						{
							name: profile._json.first_name + " " + profile._json.last_name,
							email: profile._json.email,
							socialUserId: profile.id,
							registrationType: "facebook",
							hashedPassword: "",
						},
						{
							attributes: ["id", "name", "cv", "email", "registrationType"],
							include: [
								{
									model: TipoUtilizador,
									attributes: ["id", "name"],
									as: "tipoUtilizador",
								},
							],
						},
					);
				}

				cb(null, user);
			},
		),
	);

	passport.use(
		new GoogleStrategy(
			{
				clientID: process.env.GOOGLE_CLIENT_ID,
				clientSecret: process.env.GOOGLE_CLIENT_SECRET,
				callbackURL: process.env.GOOGLE_APP_CALLBACK_URL,
			},
			async function (_accessToken, _refreshToken, profile, cb) {
				let user = await Utilizador.findOne({
					where: {
						socialUserId: profile.id,
						registrationType: "google",
					},
					attributes: ["id", "name", "cv", "email", "registrationType"],
					include: [
						{
							model: TipoUtilizador,
							attributes: ["id", "name"],
							as: "tipoUtilizador",
						},
					],
				});

				if (!user) {
					user = await Utilizador.create(
						{
							name: profile.displayName,
							email: profile._json.email,
							socialUserId: profile.id,
							registrationType: "google",
							hashedPassword: "",
						},
						{
							attributes: ["id", "name", "cv", "email", "registrationType"],
							include: [
								{
									model: TipoUtilizador,
									attributes: ["id", "name"],
									as: "tipoUtilizador",
								},
							],
						},
					);
				}

				cb(null, user);
			},
		),
	);
};
