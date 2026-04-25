import { MAIN_KEY, MODE } from "../config/env.config.js";
import ApiError from "../helpers/apiError.helper.js";
import { TransfromError } from "../helpers/baseError.helper.js";
import UserModel from "../models/User.model.js";

const FALLBACK_API_KEY = "fallback_api_key";

const findDeveloper = async (apiKey = "") => {
  return await UserModel.findOne({ apiKey: apiKey.trim() });
};

export default async (req, res, next) => {
  try {
    let apiKey = req.headers["X-API-Key"] || req.headers["x-api-key"];

    if (!apiKey && MODE === "development") {
      apiKey = FALLBACK_API_KEY;
    }

    if (!apiKey) {
      throw new ApiError("APIKey", 400, "X-API-Key Header doesn't exist", true);
    }

    if (apiKey === FALLBACK_API_KEY && MODE !== "production") {
      // In dev mode with fallback key, we might not have a user
      // but we need one for filtering. We'll pick the first user for convenience in dev.
      const firstUser = await UserModel.findOne({});
      if (firstUser) req.user = firstUser;
      return next();
    }

    if (apiKey === MAIN_KEY) {
      req.isUsingMainKey = true;
      return next();
    }
    req.isUsingMainKey = false;

    const developer = await findDeveloper(apiKey);

    if (developer) {
      req.user = developer;
      return next();
    }

    throw new ApiError("APIKey", 401, "Your API key is invalid", true);
  } catch (error) {
    error.responseType = "json";
    error.renderData = null;
    const trError = new TransfromError(error);
    next(trError);
  }
};
