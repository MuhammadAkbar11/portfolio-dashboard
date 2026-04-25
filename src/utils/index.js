import fs from "fs";
import path from "path";

export const __dirname = path.resolve();

const deleteFile = filePath => {
  const file = path.join(__dirname, filePath);

  if (fs.existsSync(file)) {
    return fs.unlink(file, err => {
      if (err) {
        console.log(error);
        throw new Error(err);
      }
    });
  }
};

export const getProfileImage = user => {
  if (!user || !user.image) return "/profile/default.png";
  if (user.image.startsWith("http")) return user.image;
  return `/${user.image}`;
};

export default deleteFile;
