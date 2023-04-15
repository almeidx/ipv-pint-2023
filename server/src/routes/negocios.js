const { Router } = require("express");
const NegociosController = require("../controllers/negocios.controller.js");

const negociosRouter = Router();

negociosRouter.get("/", NegociosController.read);

module.exports = negociosRouter;
