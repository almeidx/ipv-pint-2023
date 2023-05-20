const { create } = require("../controllers/uploads.controller.js");
const { Router } = require("express");

const uploadsRouter = Router() //
	.post("/", create);

module.exports = uploadsRouter;
