const express = require("express");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log("entering destination");

    cb(null, "fileStorage/");
  },
  filename: (req, file, cb) => {
    const fileName = `${Date.now()}-${file.originalname}`;
    console.log("entering filename");
    cb(null, fileName);
  },
});

const upload = multer({ storage });

app.use("/uploads", express.static(path.join(__dirname, "fileStorage")));

app.get("/", (req, res) => {
  console.log("entering /");
  res.render("index");
});

app.post("/upload", upload.single("file"), (req, res) => {
  console.log("entering upload");
  res.redirect("/");
});

app.delete("/delete/:fileName", (req, res) => {
  console.log("entering delete");
  const fileName = req.params.fileName;
  const filePath = path.join(__dirname, "fileStorage", fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
    res.send(`File "${fileName}" has been deleted`);
  } else {
    res.status(404).send(`File "${fileName}" not found`);
  }
});

app.get("/view", (req, res) => {
  console.log("entering view");
  const uploadDirectory = path.join(__dirname, "filestorage");
  console.log("entering view" + uploadDirectory);
  fs.readdir(uploadDirectory, (err, files) => {
    if (err) {
      console.log(err);
      res.status(500).send("Error reading the upload directory");
    } else {
      res.json({ files });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
