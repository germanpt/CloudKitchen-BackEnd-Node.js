const express = require("express");
const chefController = require("../controllers/chef.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const validateRequest = require("../middlewares/validate.middleware");
const ROLES = require("../constants/roles");

const router = express.Router();

router.patch(
  "/:id/toggle-verification",
  authMiddleware,
  authorize(ROLES.ADMIN),
  chefController.toggleVerification
);

router.put(
  "/profile",
  authMiddleware,
  authorize(ROLES.CHEF),
  chefController.updateProfile
);

module.exports = router;

