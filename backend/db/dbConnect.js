const mongoose = require("mongoose");

async function dbConnect() {
  try {
    await mongoose.set("strictQuery", false);
    await mongoose.connect("mongodb://127.0.0.1:27017/assignment");
    console.log("db connected");
  } catch (error) {
    console.log(error.message);
  }
}

module.exports = dbConnect;
