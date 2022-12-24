const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    phone: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    imgPath: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const UserModel = new mongoose.model("UserModel", userSchema);

module.exports = UserModel;
