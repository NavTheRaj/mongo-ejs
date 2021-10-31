const express = require("express"),
  app = express(),
  bodyParser = require("body-parser"),
  fs = require("fs"),
  multer = require("multer"),
  mongoose = require("mongoose");
mongoose.connect("mongodb://localhost/Images");
// app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");

//Schema
var imgSchema = mongoose.Schema({
  title: String,
  img: { data: Buffer, contentType: String },
});

// var title = mongoose.model("title", imgSchema);
var image = mongoose.model("image", imgSchema);

// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});

var upload = multer({ storage: storage });

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/show", (req, res) => {
  image.find().toArray(function (err, result) {
    const imgArray = result.map((element) => element._id);
    console.log(imgArray);
    if (err) {
      return console.error(err);
    }
    res.send(imgArray);
  });
});

app.post("/uploadphoto", upload.single("myImage"), (req, res) => {
  var img = fs.readFileSync(req.file.path);
  var encode_img = img.toString("base64");
  var final_img = {
    contentType: req.file.mimetype,
    image: new Buffer(encode_img, "base64"),
  };
  image.create(final_img, function (err, result) {
    if (err) {
      console.log(err);
    } else {
      console.log(result.img.Buffer);
      console.log("Saved To database");
      res.contentType(final_img.contentType);
      res.send(final_img.image);
    }
  });
});

//Code to start server
app.listen(2000, function () {
  console.log("Server Started at PORT 2000");
});
