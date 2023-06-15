const { Router } = require("express");
const { read } = require("../controllers/reporting.controller.js");

const reportingRouter = Router() //
	.get("/", read);

module.exports = reportingRouter;
