const { Router } = require("express");
const ClientesController = require("../controllers/clientes.controller.js");

const clientesRouter = Router();

clientesRouter.get("/", ClientesController.read);

module.exports = clientesRouter;
