import ApiError from "../helpers/apiError.helper.js";
import { TransfromError } from "../helpers/baseError.helper.js";
import UserModel from "../models/User.model.js";

/**
 * Middleware to validate API Key and attach the corresponding user to the request.
 */
export default async (req, res, next) => {
  try {
    const apiKey = req.headers["x-api-key"] || req.headers["X-API-Key"];

    if (!apiKey) {
      throw new ApiError(
        "APIKeyMissing",
        400,
        "X-API-Key header is required",
        true
      );
    }

    // Find the user associated with this API Key
    const user = await UserModel.findOne({ apiKey: apiKey.trim() });

    if (!user) {
      throw new ApiError(
        "InvalidAPIKey",
        401,
        "The provided API Key is invalid or has been revoked",
        true
      );
    }

    // Attach the user to the request context
    // We use req.user for consistency with session-based auth, 
    // but we can also use req.apiKeyUser if needed.
    req.user = user;
    req.isUsingMainKey = false; // Disable global access bypass for now as per instructions

    return next();
  } catch (error) {
    error.responseType = "json";
    const trError = new TransfromError(error);
    next(trError);
  }
};
