const { Router } = require("express");
const NotificacoesController = require("../controllers/notificacoes.controller.js");

const notificacoesRouter = Router();

notificacoesRouter.get("/", NotificacoesController.read);

module.exports = notificacoesRouter;
