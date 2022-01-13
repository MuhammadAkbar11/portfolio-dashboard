export const getProfile = (req, res) => {
  res.render("profile", {
    title: "Profile",
    path: "/profile",
  });
};
