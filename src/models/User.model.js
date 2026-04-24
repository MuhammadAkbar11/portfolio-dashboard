import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      default: undefined,
      unique: true,
      sparse: true,
    },
    authProviders: {
      type: [String],
      enum: ["local", "google"],
      default: ["local"],
    },
    image: {
      type: String,
    },
    apiKey: {
      type: String,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.methods.matchPassword = async function (enteredPassword) {
  if (!this.password) return false;
  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.hashApiKey = async function (apikey) {
  return await bcrypt.hash(apikey, 12);
};

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  if (!this.password) {
    return next();
  }

  this.password = await bcrypt.hash(this.password, 12);
});

const UserModel = mongoose.model("UserModel", userSchema, "users");

export default UserModel;
