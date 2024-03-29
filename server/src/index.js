const cookieParser = require("cookie-parser");
const cors = require("cors");
const express = require("express");
const getConnectPgFn = require("connect-pg-simple");
const helmet = require("helmet");
const morgan = require("morgan");
const passport = require("passport");
const session = require("express-session");
const { sequelize, TipoUtilizador } = require("./database/index.js");
const areasDeNegocioRouter = require("./routes/areas-de-negocio.js");
const authRouter = require("./routes/auth.js");
const beneficiosRouter = require("./routes/beneficios.js");
const candidaturasRouter = require("./routes/candidaturas.js");
const centrosDeTrabalhoRouter = require("./routes/centros-de-trabalho.js");
const clientesRouter = require("./routes/clientes.js");
const eventsRouter = require("./routes/events.js");
const ideiasRouter = require("./routes/ideias.js");
const mensagensRouter = require("./routes/mensagens.js");
const negociosRouter = require("./routes/negocios.js");
const notificacoesRouter = require("./routes/notificacoes.js");
const reportingRouter = require("./routes/reporting.js");
const reunioesRouter = require("./routes/reunioes.js");
const tiposDeProjetoRouter = require("./routes/tipos-de-projeto.js");
const tiposUtilizadorRouter = require("./routes/tipos-utilizador.js");
const utilizadoresRouter = require("./routes/utilizadores.js");
const uploadsRouter = require("./routes/uploads.js");
const vagasRouter = require("./routes/vagas.js");
const TipoUtilizadorEnum = require("./utils/TipoUtilizadorEnum.js");
const { stripIndents } = require("common-tags");

require("./middleware/passport.js")(passport);

const app = express();

app.use(
	cors({
		origin: process.env.NODE_ENV === "development" ? (_, cb) => cb(null, true) : process.env.WEB_URL,
		credentials: true,
		methods: ["HEAD", "GET", "POST", "PATCH", "OPTIONS", "DELETE"],
		optionsSuccessStatus: 200,
	}),
);

if (process.env.NODE_ENV === "production") {
	app.use(
		helmet({
			crossOriginResourcePolicy: false,
		}),
	);
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
				createTableIfMissing: true,
			}),
		}),
	)
	.use(passport.initialize())
	.use(passport.session())
	.use(morgan("dev"))
	.use("/auth", authRouter)
	.use("/areas-de-negocio", areasDeNegocioRouter)
	.use("/beneficios", beneficiosRouter)
	.use("/candidaturas", candidaturasRouter)
	.use("/centros-de-trabalho", centrosDeTrabalhoRouter)
	.use("/clientes", clientesRouter)
	.use("/events", eventsRouter)
	.use("/ideias", ideiasRouter)
	.use("/mensagens", mensagensRouter)
	.use("/negocios", negociosRouter)
	.use("/notificacoes", notificacoesRouter)
	.use("/reporting", reportingRouter)
	.use("/reunioes", reunioesRouter)
	.use("/tipos-projeto", tiposDeProjetoRouter)
	.use("/tipos-utilizador", tiposUtilizadorRouter)
	.use("/utilizadores", utilizadoresRouter)
	.use("/uploads", uploadsRouter)
	.use("/vagas", vagasRouter)
	.get("/_health", (_req, res) => res.send("OK"));

(async () => {
	console.time("Connection time");
	await sequelize.authenticate();
	console.timeEnd("Connection time");

	await sequelize.sync();

	const qntTiposUtilizador = await TipoUtilizador.count();
	if (qntTiposUtilizador === 0) {
		await TipoUtilizador.bulkCreate([
			{ name: TipoUtilizadorEnum[TipoUtilizadorEnum.Utilizador] },
			{ name: TipoUtilizadorEnum[TipoUtilizadorEnum.GestorIdeias] },
			{ name: TipoUtilizadorEnum[TipoUtilizadorEnum.GestorRecursosHumanos] },
			{ name: TipoUtilizadorEnum[TipoUtilizadorEnum.GestorNegocios] },
			{ name: TipoUtilizadorEnum[TipoUtilizadorEnum.GestorConteudos] },
			{ name: TipoUtilizadorEnum[TipoUtilizadorEnum.Administrador] },
			{ name: TipoUtilizadorEnum[TipoUtilizadorEnum.Colaborador] },
		]);
	}

	require("./jobs/reunioes.js");

	const port = process.env.PORT || 3333;

	app.listen(port, "127.0.0.1", () => console.log(`Server listening to http://localhost:${port}`));
})();
