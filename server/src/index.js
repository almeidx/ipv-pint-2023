const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const getConnectPgFn = require("connect-pg-simple");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const sgMail = require("@sendgrid/mail");
const { sequelize } = require("./database/index.js");
const authRouter = require("./routes/auth.js");
const beneficiosRouter = require("./routes/beneficios.js");
const candidaturasRouter = require("./routes/candidaturas.js");
const clientesRouter = require("./routes/clientes.js");
const contactosRouter = require("./routes/contactos.js");
const ideiasRouter = require("./routes/ideias.js");
const mensagensRouter = require("./routes/mensagens.js");
const negociosRouter = require("./routes/negocios.js");
const notificacoesRouter = require("./routes/notificacoes.js");
const reportingRouter = require("./routes/reporting.js");
const reunioesRouter = require("./routes/reunioes.js");
const tiposUtilizadorRouter = require("./routes/tipos-utilizador.js");
const utilizadoresRouter = require("./routes/utilizadores.js");
const vagasRouter = require("./routes/vagas.js");

require("./middleware/passport.js")(passport);

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

app.use(
	cors({
		origin: process.env.NODE_ENV === "production" ? process.env.WEB_URL : /.+/,
		credentials: true,
		methods: ["HEAD", "GET", "POST", "PATCH", "OPTIONS", "DELETE"],
		optionsSuccessStatus: 200,
	}),
);

if (process.env.NODE_ENV === "production") {
	app.use(helmet());
}

app
	.use(express.json())
	.use(cookieParser(process.env.SESSION_SECRET))
	.use(
		session({
			secret: process.env.SESSION_SECRET,
			saveUninitialized: false,
			resave: false,
			store: new (getConnectPgFn(session))({
				conObject: {
					connectionString: process.env.DATABASE_URL,
					ssl: true,
				},
			}),
		}),
	)
	.use(passport.initialize())
	.use(passport.session())
	.use(morgan("dev"))
	.use(authRouter)
	.use("/beneficios", beneficiosRouter)
	.use("/candidaturas", candidaturasRouter)
	.use("/clientes", clientesRouter)
	.use("/clientes/:idCliente/contactos", contactosRouter)
	.use("/ideias", ideiasRouter)
	.use("/mensagens", mensagensRouter)
	.use("/negocios", negociosRouter)
	.use("/notificacoes", notificacoesRouter)
	.use("/reporting", reportingRouter)
	.use("/reunioes", reunioesRouter)
	.use("/tipos-utilizador", tiposUtilizadorRouter)
	.use("/utilizadores", utilizadoresRouter)
	.use("/vagas", vagasRouter)
	.get("/_health", (_req, res) => res.send("OK"));

(async () => {
	console.time("Connection time");
	await sequelize.authenticate();
	console.timeEnd("Connection time");

	// await sequelize.sync({
	// 	alter: true,
	// });

	const PORT = process.env.PORT || 3333;

	app.listen(PORT, "127.0.0.1", () => console.log(`Server listening to http://localhost:${PORT}`));
})();
