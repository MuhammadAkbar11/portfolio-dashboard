import UserModel from "../models/User.model.js";
import BaseError, {
  TransfromError,
  ValidationError,
} from "../helpers/baseError.helper.js";
import httpStatusCodes from "../utils/httpStatusCode.js";

export const getSignIn = async (req, res, next) => {
  try {
    res.render("auth/sign-in", {
      title: "SignIn",
      errors: null,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);

    next(baseError);
  }
};

export const postSignIn = async (req, res, next) => {
  const { email, password } = req.body;

  try {    const user = await UserModel.findOne({
      email: String(email).toLowerCase().trim(),
    });

    if (!user) {
      throw new BaseError(
        "BadRequest",
        httpStatusCodes.BAD_REQUEST,
        "User not found",
        true,
        {
          errorView: "auth/sign-in",
          renderData: {
            title: "SignIn",
            values: req.body,
          },
        },
      );
    }

    const passwordMatch = await user.matchPassword(password);

    if (!passwordMatch) {
      throw new BaseError(
        "BadRequest",
        httpStatusCodes.BAD_REQUEST,
        "Wrong password",
        true,
        {
          errorView: "auth/sign-in",
          renderData: {
            title: "SignIn",
            values: req.body,
          },
        },
      );
    }

    next();
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const getSignUp = async (req, res, next) => {
  try {
    res.render("auth/signup", {
      title: "Sign Up",
      errors: null,
      values: null,
    });
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const postSignUp = async (req, res, next) => {
  const { email, password } = req.body;
  try {    const normalizedEmail = String(email).toLowerCase().trim();
    const nameFromEmail = normalizedEmail.includes("@")
      ? normalizedEmail.split("@")[0]
      : "User";

    const existing = await UserModel.findOne({ email: normalizedEmail });

    if (existing) {
      throw new BaseError(
        "BadRequest",
        httpStatusCodes.BAD_REQUEST,
        "User already exists",
        true,
        {
          errorView: "auth/signup",
          renderData: {
            title: "Sign Up",
            values: req.body,
          },
        },
      );
    }

    await UserModel.create({
      name: nameFromEmail || "User",
      email: normalizedEmail,
      password,
      authProviders: ["local"],
    });

    next();
  } catch (error) {
    const baseError = new TransfromError(error);
    next(baseError);
  }
};

export const getLocalAuthCallback = (req, res) => {
  try {
    res.redirect("/dashboard");
  } catch (error) {
    req.flash("flashdata", {
      type: "danger",
      message: "Opps, SignIn failed please try again",
    });
    res.redirect("/auth");
  }
};

export const postLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};
