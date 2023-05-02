const { Router } = require("express");
const { create, read, delete_ } = require("../controllers/mensagens.controller.js");

const mensagensRouter = Router();

mensagensRouter.get("/", read);
mensagensRouter.post("/", create);
mensagensRouter.delete("/:id", delete_);

module.exports = mensagensRouter;
