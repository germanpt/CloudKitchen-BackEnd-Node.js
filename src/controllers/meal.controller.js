const mealService = require("../services/meal.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

class MealController {
  _getFullUrl = (req, relativePath) => {
    if (!relativePath) return null;
    const sanitizedPath = relativePath.replace(/\\/g, "/");
    return `${req.protocol}://${req.get("host")}/${sanitizedPath}`;
  };

  _formatMealResponse = (req, meal) => {
    const mealObj = meal.toObject ? meal.toObject() : meal;
    return {
      ...mealObj,
      images: mealObj.images.map((img) => this._getFullUrl(req, img)),
    };
  };

  createMeal = asyncHandler(async (req, res) => {
    const chefId = req.user._id;

    if (!req.files || !req.files.mealImages || req.files.mealImages.length === 0) {
      throw new ApiError(400, "At least one meal image is required");
    }

    if (req.files.mealImages.length > 3) {
      throw new ApiError(400, "Maximum 3 images allowed per meal");
    }

    const imagePaths = req.files.mealImages.map((file) => file.path);

    const mealData = {
      ...req.body,
      images: imagePaths,
      // Parse ingredients if it's a string (from form-data)
      ingredients: typeof req.body.ingredients === 'string' 
        ? JSON.parse(req.body.ingredients) 
        : req.body.ingredients
    };

    const meal = await mealService.createMeal(chefId, mealData);

    res.status(201).json(
      new ApiResponse(201, this._formatMealResponse(req, meal), "Meal created successfully")
    );
  });

  getAllMeals = asyncHandler(async (req, res) => {
    const meals = await mealService.getAllMeals(req.query);
    const formattedMeals = meals.map((meal) => this._formatMealResponse(req, meal));

    res.status(200).json(
      new ApiResponse(200, formattedMeals, "Meals retrieved successfully")
    );
  });

  getMealById = asyncHandler(async (req, res) => {
    const meal = await mealService.getMealById(req.params.id);

    res.status(200).json(
      new ApiResponse(200, this._formatMealResponse(req, meal), "Meal retrieved successfully")
    );
  });

  updateMeal = asyncHandler(async (req, res) => {
    const mealId = req.params.id;
    const chefId = req.user._id;
    let updateData = { ...req.body };

    if (req.files && req.files.mealImages) {
      updateData.images = req.files.mealImages.map((file) => file.path);
    }

    if (updateData.ingredients && typeof updateData.ingredients === 'string') {
      updateData.ingredients = JSON.parse(updateData.ingredients);
    }

    const meal = await mealService.updateMeal(mealId, chefId, updateData);

    res.status(200).json(
      new ApiResponse(200, this._formatMealResponse(req, meal), "Meal updated successfully")
    );
  });

  deleteMeal = asyncHandler(async (req, res) => {
    const mealId = req.params.id;
    const chefId = req.user._id;

    await mealService.deleteMeal(mealId, chefId);

    res.status(200).json(
      new ApiResponse(200, null, "Meal deleted successfully")
    );
  });

  updateStatus = asyncHandler(async (req, res) => {
    const mealId = req.params.id;
    const chefId = req.user._id;
    const { status } = req.body;

    const meal = await mealService.updateMealStatus(mealId, chefId, status);

    res.status(200).json(
      new ApiResponse(200, this._formatMealResponse(req, meal), "Meal status updated successfully")
    );
  });
}

module.exports = new MealController();
