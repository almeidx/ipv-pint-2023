const { Router } = require("express");
const BeneficiosController = require("../controllers/beneficios.controller.js");

const beneficiosRouter = Router();

beneficiosRouter.get("/", BeneficiosController.read);

module.exports = beneficiosRouter;
