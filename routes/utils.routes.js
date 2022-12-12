// Dependencies
const { Router } = require("express");
const express = require("express");
const path = require("path");

// controller
const utils = require("../controllers/utils.controller");

// Stuff
const router = express.Router();

// Routes
router.get("/ping", utils.getPingController);
router.post("/session/book", utils.postBookSessionController);
router.get("/session/schedule", utils.getScheduleController);

module.exports = router;
