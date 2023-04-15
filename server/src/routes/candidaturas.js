const { Router } = require("express");
const CandidaturasController = require("../controllers/candidaturas.controller.js");

const candidaturasRouter = Router();

candidaturasRouter.get("/", CandidaturasController.read);

module.exports = candidaturasRouter;
