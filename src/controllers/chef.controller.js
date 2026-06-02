const chefService = require("../services/chef.service");
const ApiResponse = require("../utils/ApiResponse");
const asyncHandler = require("../utils/asyncHandler");

class ChefController {
  toggleVerification = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const chef = await chefService.toggleVerification(id);

    res.status(200).json(
      new ApiResponse(
        200,
        chef,
        `Chef verification status toggled to ${chef.isVerified}`
      )
    );
  });

  updateProfile = asyncHandler(async (req, res) => {
    // Assuming the user is updating their own profile
    const chefId = req.user._id;
    const chef = await chefService.updateProfile(chefId, req.body);

    res.status(200).json(
      new ApiResponse(200, chef, "Chef profile updated successfully")
    );
  });
}

module.exports = new ChefController();
