const { Router } = require("express");
const TiposUtilizadorController = require("../controllers/tipos-utilizador.controller.js");

const tiposUtilizadorRouter = Router();

tiposUtilizadorRouter.get("/", TiposUtilizadorController.read);

module.exports = tiposUtilizadorRouter;
