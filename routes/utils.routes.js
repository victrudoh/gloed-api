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
router.post("/session/book-free", utils.postBookFreeSessionController);
router.post("/session/book-paid", utils.postBookPaidSessionController);
router.get("/session/verify-payment", utils.getVerifyController);
router.get("/session/schedule", utils.getScheduleController);

// Routes without authentication
router.post(
    "/session/book-free-unauth",
    utils.postBookFreeUnauthSessionController
);
router.post(
    "/session/book-paid-unauth",
    utils.postBookPaidUnauthSessionController
);
router.get("/session/verify-payment-unauth", utils.getVerifyUnauthController);

module.exports = router;