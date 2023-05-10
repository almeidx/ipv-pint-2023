const { Router } = require("express");
const { create, read, update } = require("../controllers/utilizadores.controller.js");

const utilizadoresRouter = Router().post("/:id", create).get("/", read).patch("/:id", update);

module.exports = utilizadoresRouter;
