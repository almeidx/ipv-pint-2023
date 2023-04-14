const express = require("express");
const { sequelize } = require("./database/index.js");
const beneficiosRouter = require("./routes/beneficios.js");
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

app.use("/beneficios", beneficiosRouter);

(async () => {
	console.time("Connection time");
	await sequelize.authenticate();
	console.timeEnd("Connection time");

	// await sequelize.sync({ force: true });

	const PORT = process.env.PORT || 3333;

	app.listen(PORT, () => console.log(`Server listening to http://localhost:${PORT}`));
})();
