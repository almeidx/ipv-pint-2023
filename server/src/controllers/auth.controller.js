const { Utilizador } = require("../database/index.js");
const jwt = require("jsonwebtoken");
const sgMail = require("@sendgrid/mail");
const { authenticate } = require("../database/model/Utilizador.js");
const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

module.exports = {
	async create(req, res) {
		const { name, email, password } = req.body;

		if (!name || !email || !password) {
			res.status(400).json({
				message: "Invalid request",
			});

			return;
		}

		const existingUser = await Utilizador.findOne({
			where: {
				email,
			},
		});

		if (existingUser) {
			res.status(409).json({
				message: "User already exists",
			});

			return;
		}

		const token = jwt.sign({ email }, process.env.JWT_ACCOUNT_ACTIVATE, { expiresIn: "1h" });

		const user = await Utilizador.create({
			name,
			email,
			password,
			salt: "",
			hasConfirmed: false,
			confirmCode: token,
			confirmDateStart: new Date(),
		});

		const emailData = {
			from: process.env.EMAIL_FROM,
			to: email,
			subject: "Account activation link",
			html: `
				<h1>Please use the following link to activate your account</h1>
				<p>${process.env.WEB_URL}/auth/activate/${token}</p>
				<hr />
				<p>Do not share this link with anyone</p>
			`,
		};

		try {
			await sgMail.send(emailData);

			res.json({
				message: `Email has been sent to ${email}. Follow the instructions to activate your account`,
			});
		} catch (error) {
			console.log(error);

			res.status(500).json({
				message: "Internal server error",
			});
		}
	},

	async activate(req, res) {
		const { token } = req.body;

		if (!token) {
			res.status(400).json({
				message: "Invalid request",
			});

			return;
		}

		try {
			const decoded = jwt.verify(token, process.env.JWT_ACCOUNT_ACTIVATE);

			const { email } = decoded;

			const user = await Utilizador.findOne({
				where: {
					email,
				},
			});

			if (!user) {
				res.status(404).json({
					message: "User not found",
				});

				return;
			}

			await user.update({
				hasConfirmed: true,
				confirmCode: null,
				confirmDateStart: null,
			});

			res.json({
				message: "User activated successfully",
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
					isActive: user.isActive,
				},
			});
		} catch (error) {
			console.log(error);

			res.status(500).json({
				message: "Internal server error",
			});
		}
	},

	async login(req, res) {
		const { email, password } = req.body;

		if (!email || !password) {
			res.status(400).json({
				message: "Invalid request",
			});

			return;
		}

		const user = await Utilizador.findOne({
			where: {
				email,
			},
		});

		if (!user) {
			res.status(404).json({
				message: "User not found",
			});

			return;
		}

		if (!user.hasConfirmed) {
			res.status(401).json({
				message: "User not confirmed",
			});

			return;
		}

		if (!authenticate(password, user.hashedPassword, user.salt)) {
			res.status(401).json({
				message: "Invalid credentials",
			});

			return;
		}

		const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

		res.json({
			token,
			user: {
				id: user.id,
				name: user.name,
				email: user.email,
			},
		});
	},
};

exports.requireLogin = expressJwt({
	secret: process.env.JWT_SECRET,
});

exports.adminMiddleware = async function adminMiddleware(req, res, next) {
	const user = await Utilizador.findById(req.user.id);

	if (!user) {
		res.status(404).json({
			message: "User not found",
		});

		return;
	}

	// TODO: Make this better
	if (!user.idTipoUtilizador !== 5) {
		res.status(403).json({
			message: "Access denied",
		});

		return;
	}

	req.profile = user;

	next();
};

exports.forgotPassword = async function forgotPassword(req, res) {
	const { email } = req.body;

	if (!email) {
		res.status(400).json({
			message: "Invalid request",
		});

		return;
	}

	const user = await Utilizador.findOne({
		where: {
			email,
		},
	});

	if (!user) {
		res.status(404).json({
			message: "User not found",
		});

		return;
	}

	const token = jwt.sign({ id: user.id }, process.env.JWT_RESET_PASSWORD, { expiresIn: "10m" });

	const emailData = {
		from: process.env.EMAIL_FROM,
		to: email,
		subject: "Password reset link",
		html: `
			<h1>Please use the following link to reset your password</h1>
			<p>${process.env.WEB_URL}/auth/password/reset/${token}</p>
			<hr />
			<p>This link will expire in 10 minutes</p>

			<p>Do not share this link with anyone</p>
		`,
	};

	try {
		await sgMail.send(emailData);

		await user.update({
			newPasswordCode: token,
			newPasswordDate: new Date(),
		});

		res.json({
			message: `Email has been sent to ${email}. Follow the instructions to reset your password`,
		});
	} catch (error) {
		console.log(error);

		res.status(500).json({
			message: "Internal server error",
		});
	}
};

exports.googleLogin = async function googleLogin(req, res) {
	const { idToken } = req.body;

	try {
		const { email_verified, name, email } = await client.verifyIdToken({
			idToken,
			audience: process.env.GOOGLE_CLIENT_ID,
		});

		if (!email_verified) {
			res.status(400).json({
				message: "Google login failed. Try again",
			});

			return;
		}

		const user = await Utilizador.findOne({
			where: {
				email,
			},
		});

		// https://youtu.be/NwPmhuT2Ng8?t=511

		if (user) {
			const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "7d" });

			res.json({
				token,
				user: {
					id: user.id,
					name: user.name,
					email: user.email,
				},
			});
		}
	} catch {}
};
