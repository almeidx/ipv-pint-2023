const { Router } = require("express");
const { create, read, update, destroy } = require("../controllers/reunioes.controller.js");
const {
	create: createNote,
	read: listNotes,
	destroy: destroyNote,
} = require("../controllers/notas-reuniao.controller.js");

const reunioesRouter = Router()
	.get("/", read)
	.post("/", create)
	.patch("/:id", update)
	.delete("/:id", destroy)
	.get("/:id/notas", listNotes)
	.post("/:id/notas", createNote)
	.delete("/:id/notas/:idNote", destroyNote);

module.exports = reunioesRouter;
