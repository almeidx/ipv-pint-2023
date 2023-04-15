const { Router } = require("express");
const VagasController = require("../controllers/vagas.controller.js");

const vagasRouter = Router();

vagasRouter.get("/", VagasController.read);

module.exports = vagasRouter;
