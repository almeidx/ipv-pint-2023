const express = require("express");
const { sequelize } = require("./database/index.js");
const beneficiosRouter = require("./routes/beneficios.js");
const vagasRouter = require("./routes/vagas.js");
const ideiasRouter = require("./routes/ideias.js");
const reunioesRouter = require("./routes/reunioes.js");
const utilizadoresRouter = require("./routes/utilizadores.js");
const contactosRouter = require("./routes/contactos.js");
const clientesRouter = require("./routes/clientes.js");
const notificacoesRouter = require("./routes/notificacoes.js");
const negociosRouter = require("./routes/negocios.js");
const candidaturasRouter = require("./routes/candidaturas.js");
const cors = require("cors");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	}),
);

app.get("/_health", (_req, res) => res.send("OK"));

app.use("/beneficios", beneficiosRouter);
app.use("/candidaturas", candidaturasRouter);
app.use("/clientes", clientesRouter);
app.use("/clientes/:idCliente/contactos", contactosRouter);
app.use("/ideias", ideiasRouter);
app.use("/negocios", negociosRouter);
app.use("/notificacoes", notificacoesRouter);
app.use("/reunioes", reunioesRouter);
app.use("/utilizadores", utilizadoresRouter);
app.use("/vagas", vagasRouter);

(async () => {
	console.time("Connection time");
	await sequelize.authenticate();
	console.timeEnd("Connection time");

	// await sequelize.sync({ force: true });

	const PORT = process.env.PORT || 3333;

	app.listen(PORT, () => console.log(`Server listening to http://localhost:${PORT}`));
})();
