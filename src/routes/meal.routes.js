const express = require("express");
const mealController = require("../controllers/meal.controller");
const authMiddleware = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const upload = require("../middlewares/upload.middleware");
const ROLES = require("../constants/roles");

const validateRequest = require("../middlewares/validate.middleware");

const router = express.Router();

// Public routes
router.get("/", mealController.getAllMeals);
router.get("/:id", mealController.getMealById);

// Protected routes (Chef only)
router.post(
  "/",
  authMiddleware,
  authorize(ROLES.CHEF),
  upload.fields([{ name: "mealImages", maxCount: 3 }]),
  validateRequest(["name", "description", "price", "category"]),
  mealController.createMeal
);

router.put(
  "/:id",
  authMiddleware,
  authorize(ROLES.CHEF),
  upload.fields([{ name: "mealImages", maxCount: 3 }]),
  mealController.updateMeal
);

router.delete(
  "/:id",
  authMiddleware,
  authorize(ROLES.CHEF),
  mealController.deleteMeal
);

router.patch(
  "/:id/status",
  authMiddleware,
  authorize(ROLES.CHEF),
  mealController.updateStatus
);

module.exports = router;
