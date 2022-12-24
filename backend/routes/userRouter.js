import fileUpload from "express-fileupload";
import express from "express";
const userRouter = express.Router();
import * as url from "url";
const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

// userRouter.route("/").get((req, res) => {
//   //   res.json()
// });

userRouter.route("/upload").post((req, res) => {
  try {
    const { image } = req.files;
    console.log(image);
    if (!image) return res.sendStatus(400);
    // if (/^image/.test(image.mimetype)) return res.sendStatus(400);

    image.mv(__dirname + "/upload/" + image.name);
    return res.json({
      status: true,
      msg: "fodne",
    });
  } catch (error) {
    console.log(error.message);
    res.json({
        msg:error.message
    })
  }
});

export default userRouter;
