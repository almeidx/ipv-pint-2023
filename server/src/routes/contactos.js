const { Router } = require("express");
const ContactosController = require("../controllers/vagas.controller.js");

const contactosRouter = Router();

contactosRouter.get("/", ContactosController.read);

module.exports = contactosRouter;
