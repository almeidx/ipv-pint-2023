const bcrypt = require("bcrypt");
const { Utilizador, TipoUtilizador } = require("../database/index.js");
const { Op } = require("sequelize");
const TipoUtilizadorEnum = require("../utils/TipoUtilizadorEnum.js");
const LocalStrategy = require("passport-local").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { isSoftinsaEmail } = require("../utils/isSoftinsaEmail.js");
const { PASSWORD_RESET_TOKEN, MOBILE_GOOGLE_AUTH_TOKEN } = require("../utils/constants.js");

module.exports = function (passport) {
	passport.serializeUser(function (user, done) {
		done(null, user);
	});

	passport.deserializeUser(function (user, done) {
		done(null, user);
	});

	const selectOptions = {
		attributes: ["id", "name", "cv", "email", "registrationType"],
		include: [
			{
				model: TipoUtilizador,
				attributes: ["id", "name"],
				as: "tipoUtilizador",
			},
		],
	};

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
					...selectOptions,
					attributes: [...selectOptions.attributes, "hashedPassword"],
				});

				if (!user) {
					return done(null, false);
				}

				console.log({
					email: username,
					registrationType: user.registrationType,
					isMobileAuthToken: password === MOBILE_GOOGLE_AUTH_TOKEN,
				});

				if (user.registrationType !== "email" && password !== MOBILE_GOOGLE_AUTH_TOKEN) {
					return done(new Error(`Conta ${user.registrationType}`), false);
				}

				const userObj = user.toJSON();

				const passwordMatches = await bcrypt.compare(password, userObj.hashedPassword);

				if (passwordMatches || password === PASSWORD_RESET_TOKEN || password === MOBILE_GOOGLE_AUTH_TOKEN) {
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
				const email = profile._json.email;
				const existingUserWithEmail = await Utilizador.findOne({
					where: {
						email,
						socialUserId: { [Op.ne]: profile.id },
						registrationType: { [Op.ne]: "facebook" },
					},
				});

				if (existingUserWithEmail) {
					return cb(null, false, { message: "Email already in use" });
				}

				let user = await Utilizador.findOne({
					where: {
						socialUserId: profile.id,
						registrationType: "facebook",
					},
					...selectOptions,
				});

				if (!user) {
					user = await Utilizador.create({
						name: profile._json.first_name + " " + profile._json.last_name,
						email: profile._json.email,
						socialUserId: profile.id,
						registrationType: "facebook",
						hashedPassword: "",
						idTipoUser: isSoftinsaEmail(profile._json.email)
							? TipoUtilizadorEnum.Colaborador
							: TipoUtilizadorEnum.Utilizador,
					});

					user = await Utilizador.findByPk(user.id, selectOptions);
				}

				cb(null, user.toJSON());
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
					...selectOptions,
				});

				if (!user) {
					user = await Utilizador.create({
						name: profile.displayName,
						email: profile._json.email,
						socialUserId: profile.id,
						registrationType: "google",
						hashedPassword: "",
						idTipoUser: isSoftinsaEmail(profile._json.email)
							? TipoUtilizadorEnum.Colaborador
							: TipoUtilizadorEnum.Utilizador,
					});

					user = await Utilizador.findByPk(user.id, selectOptions);
				}

				cb(null, user.toJSON());
			},
		),
	);
};
