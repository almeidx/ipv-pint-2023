const { Router } = require("express");
const UtilizadoresController = require("../controllers/utilizadores.controller.js");

const utilizadoresRouter = Router().get("/", UtilizadoresController.read).get("/:id", UtilizadoresController.create);

module.exports = utilizadoresRouter;
