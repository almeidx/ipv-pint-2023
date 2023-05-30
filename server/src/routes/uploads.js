const { create, read } = require("../controllers/uploads.controller.js");
const { Router } = require("express");

const uploadsRouter = Router() //
	.get("/:fileName", read)
	.post("/", create);

module.exports = uploadsRouter;
