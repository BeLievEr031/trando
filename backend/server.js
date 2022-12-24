const express = require("express");
const fileUpload = require("express-fileupload");
const dotenv = require("dotenv");
const cors = require("cors");
const path = require("path");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = express();
const port = 5000;
const dbConnect = require("./db/dbConnect");
const UserModel = require("./models/UserModel");
const fs = require("fs");
const { default: mongoose } = require("mongoose");

dotenv.config();

app.use(
  fileUpload({
    limits: {
      fileSize: 10000000,
    },
    abortOnLimit: true,
  })
);

app.use(cors());
app.use(express.json());

dbConnect();
app.get("/", (req, res) => {
  res.send("Hello World!");
});

const date = new Date();

app.post("/upload", (req, res) => {
  const { image } = req.files;

  let ext = image.name.includes("png") ? "png" : "jpeg";

  const { img_name } = req.headers;
  if (!image) {
    return res.json({
      success: false,
      msg: "All fields required..",
    });
  }

  const isExist = fs.existsSync(
    path.join(
      __dirname,
      `/upload/${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`
    )
  );

  let uploadPath = path.join(__dirname, "/upload");
  let dateFolder = `${date.getFullYear()}-${
    date.getMonth() + 1
  }-${date.getDate()}`;

  if (!isExist) {
    fs.mkdir(path.join(uploadPath, dateFolder), (err) => {
      if (err) {
        console.log(err);
      }
    });
  }

  image.mv(__dirname + `/upload/${dateFolder}/` + img_name + "." + ext);

  res.json({
    success: true,
    msg: "img uploaded",
  });
});

app.post("/signup", async (req, res) => {
  const { email, name, phone, password } = req.body;

  if (!email || !name || !phone || !password) {
    return res.json({
      success: false,
      msg: "All fileds required..",
    });
  }

  const isExist = await UserModel.findOne({ email });

  if (isExist) {
    return res.json({
      success: false,
      msg: "User already exists",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = new UserModel({
    email,
    name,
    phone,
    password: hashedPassword,
    imgPath: `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`,
  });

  await user.save();
  res.json({
    success: true,
    user,
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  if (!email || !password) {
    return res.json({
      success: false,
      msg: "All fields required..",
    });
  }

  const isUser = await UserModel.findOne({ email }).select("+password");

  if (!isUser) {
    return res.json({
      success: false,
      msg: "Invalid Credentials..",
    });
  }

  let user = isUser;

  const isPassword = await bcrypt.compare(password, user.password);

  if (!isPassword) {
    return res.json({
      success: false,
      msg: "Invalid Credentials..",
    });
  }

  const token = jwt.sign(
    {
      userID: user._id,
    },
    process.env.JWT_SECRET
  );

  res.status(200).json({
    success: true,
    token,
    msg: "User Logged In..",
    user,
  });
});

app.use("/img", express.static("upload"));

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
