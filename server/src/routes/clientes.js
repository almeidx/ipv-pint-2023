const { Router } = require("express");
const { create, read } = require("../controllers/clientes.controller.js");
const { create: createContactos, read: readContactos } = require("../controllers/contactos.controller.js");

const clientesRouter = Router()
	.get("/", read)
	.post("/", create)
	.get("/:id/contactos", readContactos)
	.post("/:id/contactos", createContactos);

module.exports = clientesRouter;
