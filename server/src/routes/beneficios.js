const { Router } = require("express");
const { BeneficiosController } = require("../controllers/beneficios.js");

const route = Router();

route.get("/", BeneficiosController.read);

module.exports = route;
