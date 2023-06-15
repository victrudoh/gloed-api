// Dependencies
const { Router } = require("express");
const express = require("express");
const path = require("path");

// controller
const auth = require("../controllers/auth.controller");

// Stuff
const router = express.Router();

// Routes
router.get("/ping", auth.getPingController);
router.post("/register", auth.postRegisterController);
router.post("/login", auth.postLoginController);
router.get("/boost", auth.getMakeAdminController);
router.get("/profile", auth.getUserProfileController);

module.exports = router;