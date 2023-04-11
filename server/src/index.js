const express = require("express");
const { sequelize, AreaNegocio } = require("./database/index.js");

const app = express();

app.get("/", async (_req, res) => {
	res.json({ hello: "world" });
});

(async () => {
	console.time("Connection time");
	await sequelize.authenticate();
	console.timeEnd("Connection time");

	await sequelize.sync({ force: true });

	console.log(await AreaNegocio.findAll());

	const PORT = process.env.PORT || 3333;

	app.listen(PORT, () => console.log(`Server listening to http://localhost:${PORT}`));
})();
