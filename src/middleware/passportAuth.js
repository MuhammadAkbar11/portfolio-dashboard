import passport from "passport";

export const passportAuthSignIn = passport.authenticate("local", {
  failureRedirect: "/auth",
  successRedirect: "/",
  failureFlash: true,
});

export const passportAuthGoogle = passport.authenticate("google", {
  scope: ["profile", "email"],
});

export const passportAuthGoogleCallback = passport.authenticate("google", {
  failureRedirect: "/auth",
  failureFlash: true,
});
