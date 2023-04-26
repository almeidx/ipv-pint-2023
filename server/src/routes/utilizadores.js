const { Router } = require("express");
const UtilizadoresController = require("../controllers/utilizadores.controller.js");

const utilizadoresRouter = Router();

utilizadoresRouter.get("/", UtilizadoresController.read);
utilizadoresRouter.get("/:id", UtilizadoresController.create);

module.exports = utilizadoresRouter;
