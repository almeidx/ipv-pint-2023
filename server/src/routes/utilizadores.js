const { Router } = require("express");
const UtilizadoresController = require("../controllers/utilizadores.controller.js");

const utilizadoresRouter = Router();

utilizadoresRouter.get("/", UtilizadoresController.read);

module.exports = utilizadoresRouter;
