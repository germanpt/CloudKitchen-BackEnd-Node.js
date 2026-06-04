const chefVerificationService = require("../services/chefVerification.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");
const {
  uploadSingleImage,
} = require("../utils/cloudinaryUpload");

class ChefVerificationController {
  _formatRequestResponse = (req, verificationRequest) => {
    const requestObj = verificationRequest.toObject();
    return {
      ...requestObj,
      nationalIdImage: requestObj.nationalIdImage,
      healthCertificateImage: requestObj.healthCertificateImage,
    };
  };

  submitRequest = asyncHandler(async (req, res) => {
    const chefId = req.user._id;

    const nationalIdImageFile = req.files?.nationalIdImage?.[0];
    const healthCertificateImageFile = req.files?.healthCertificateImage?.[0];

    if (!nationalIdImageFile || !healthCertificateImageFile) {
      throw new ApiError(
        400,
        "Both National ID and Health Certificate images are required"
      );
    }

    const [nationalIdImageUrl, healthCertificateImageUrl] = await Promise.all([
      uploadSingleImage(nationalIdImageFile, "cloudkitchen/chef-verifications"),
      uploadSingleImage(
        healthCertificateImageFile,
        "cloudkitchen/chef-verifications"
      ),
    ]);

    const request = await chefVerificationService.submitVerificationRequest(
      chefId,
      nationalIdImageUrl,
      healthCertificateImageUrl
    );

    res
      .status(201)
      .json(
        new ApiResponse(
          201,
          this._formatRequestResponse(req, request),
          "Verification request submitted successfully"
        )
      );
  });

  getStatus = asyncHandler(async (req, res) => {
    const chefId = req.user._id;
    const request = await chefVerificationService.getVerificationStatus(chefId);

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          this._formatRequestResponse(req, request),
          "Verification status retrieved successfully"
        )
      );
  });

  updateStatus = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      throw new ApiError(400, "Status is required");
    }

    const request = await chefVerificationService.updateVerificationStatus(
      id,
      status
    );

    res
      .status(200)
      .json(
        new ApiResponse(
          200,
          this._formatRequestResponse(req, request),
          "Verification status updated successfully"
        )
      );
  });
}

module.exports = new ChefVerificationController();
