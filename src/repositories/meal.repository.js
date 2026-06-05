const Meal = require("../models/Meal");

class MealRepository {
  async create(mealData) {
    return await Meal.create(mealData);
  }

  async findById(id) {
    return await Meal.findById(id)
      .populate("chefId", "firstName lastName kitchenName")
      .populate("categories");
  }

  async findAll(filter = {}) {
    return await Meal.find(filter)
      .populate("chefId", "firstName lastName kitchenName")
      .populate("categories");
  }

  async update(id, updateData) {
    return await Meal.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });
  }

  async delete(id) {
    return await Meal.findByIdAndDelete(id);
  }

  async findActiveWithRanking(categoryIds = []) {
    const mongoose = require("mongoose");
    const objectCategoryIds = categoryIds.map(
      (id) => new mongoose.Types.ObjectId(id)
    );

    const pipeline = [
      {
        $match: {
          status: "active",
        },
      },
    ];

    if (objectCategoryIds.length > 0) {
      pipeline.push({
        $match: {
          categories: { $in: objectCategoryIds },
        },
      });

      pipeline.push({
        $addFields: {
          matchCount: {
            $size: {
              $setIntersection: ["$categories", objectCategoryIds],
            },
          },
        },
      });

      pipeline.push({
        $sort: { matchCount: -1, createdAt: -1 },
      });
    } else {
      pipeline.push({
        $sort: { createdAt: -1 },
      });
    }

    const meals = await Meal.aggregate(pipeline);

    // Populate chefId and categories since aggregate doesn't do it automatically
    return await Meal.populate(meals, [
      { path: "chefId", select: "firstName lastName kitchenName" },
      { path: "categories" },
    ]);
  }
}

module.exports = new MealRepository();
