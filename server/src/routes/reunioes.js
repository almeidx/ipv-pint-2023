const { Router } = require("express");
const reunioesController = require("../controllers/reunioes.controller.js");

const reunioesRouter = Router();

reunioesRouter.get("/", reunioesController.read);

module.exports = reunioesRouter;
