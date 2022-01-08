import passport from "passport";

export const passportAuthSignIn = passport.authenticate("local", {
  failureRedirect: "/auth",
  successRedirect: "/",
  failureFlash: true,
});
