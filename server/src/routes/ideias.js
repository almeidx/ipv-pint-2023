const { Router } = require("express");
const ideiasController = require("../controllers/ideias.controller.js");

const ideiasRouter = Router();

ideiasRouter.get("/", ideiasController.read);

module.exports = ideiasRouter;
