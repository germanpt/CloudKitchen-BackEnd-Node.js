const chefVerificationService = require("../services/chefVerification.service");
const ApiResponse = require("../utils/ApiResponse");
const ApiError = require("../utils/ApiError");
const asyncHandler = require("../utils/asyncHandler");

class ChefVerificationController {
  /**
   * Helper to convert relative path to full URL
   */
  _getFullUrl = (req, relativePath) => {
    if (!relativePath) return null;
    // Replace backslashes with forward slashes for URL consistency
    const sanitizedPath = relativePath.replace(/\\/g, "/");
    return `${req.protocol}://${req.get("host")}/${sanitizedPath}`;
  };

  /**
   * Helper to format the request object with full URLs
   */
  _formatRequestResponse = (req, verificationRequest) => {
    const requestObj = verificationRequest.toObject();
    return {
      ...requestObj,
      nationalIdImage: this._getFullUrl(req, requestObj.nationalIdImage),
      healthCertificateImage: this._getFullUrl(req, requestObj.healthCertificateImage),
    };
  };

  submitRequest = asyncHandler(async (req, res) => {
    const chefId = req.user._id;

    if (
      !req.files ||
      !req.files.nationalIdImage ||
      !req.files.healthCertificateImage
    ) {
      throw new ApiError(
        400,
        "Both National ID and Health Certificate images are required"
      );
    }

    // Get relative paths from Multer
    const nationalIdImagePath = req.files.nationalIdImage[0].path;
    const healthCertificateImagePath = req.files.healthCertificateImage[0].path;

    const request = await chefVerificationService.submitVerificationRequest(
      chefId,
      nationalIdImagePath,
      healthCertificateImagePath
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
