const express = require("express");
const authController = require("../controllers/auth.controller");
const authMiddleware = require("../middlewares/auth.middleware");

const router = express.Router();

router.get("/me", authMiddleware, authController.me);
router.post("/register", authController.register);
router.post("/login", authController.login);

module.exports = router;
