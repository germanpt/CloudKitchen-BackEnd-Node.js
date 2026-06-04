const Meal = require("../models/Meal");

class MealRepository {
  async create(mealData) {
    return await Meal.create(mealData);
  }

  async findById(id) {
    return await Meal.findById(id).populate("chefId", "firstName lastName kitchenName");
  }

  async findAll(filter = {}) {
    return await Meal.find(filter).populate("chefId", "firstName lastName kitchenName");
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
}

module.exports = new MealRepository();
