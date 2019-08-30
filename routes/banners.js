const express = require("express");
const router = express.Router();
const Banner = require("../models/banner");
const multer = require("multer");
const fs = require("fs");
const dir = "public\\";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === "image/jpeg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter: fileFilter
}).single("banner");

router.post("/banner", (req, res) => {
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) return res.status(500).json(err);

    Banner.findOne({ name: req.body.name }).then(banner => {
      if (banner)
        return res.status(400).json({ name: "Баннер бүртгэгдсэн байна." });
      const newBanner = new Banner({
        name: req.body.name,
        image: req.file.filename
      });
      newBanner
        .save()
        .then(result => {
          res.status(200).json({
            message: "Амжилттай хадгалагдлаа."
          });
        })
        .catch(err => res.json({ error: err }));
    });
  });
});

router.get("/banner", (req, res) => {
  Banner.find()
    .select("name image")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        banners: docs.map(doc => {
          return {
            name: doc.name,
            image: doc.image
          };
        })
      };
      res.status(200).json(response);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });
    });
});

router.delete("/banner", (req, res) => {
  Banner.deleteOne({ name: req.body.name })
    .then(result => {
      const filepath = `${dir}${req.body.image}`;
      fs.unlinkSync(filepath);
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(400).send(err);
      console.log(err);
    });
});

module.exports = router;
