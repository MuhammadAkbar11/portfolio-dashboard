import { Strategy } from "passport-local";
import BaseError, { TransfromError } from "../../helpers/baseError.helper.js";
import UserModel from "../../models/User.model.js";

const LocalStrategy = new Strategy(
  {
    usernameField: "email",
    passwordField: "password",
  },
  async function (email, password, done) {
    try {
      const user = await UserModel.findOne({
        email: String(email).toLowerCase().trim(),
      });

      if (!user) {
        return done(null, false, { message: "User not found" });
      }

      const isMatch = await user.matchPassword(password);
      if (!isMatch) {
        return done(null, false, { message: "Wrong password" });
      }

      return done(null, user);
    } catch (err) {
      done(new TransfromError(err));
    }
  }
);

export default LocalStrategy;
