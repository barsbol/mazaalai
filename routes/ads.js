const express = require("express");
const router = express.Router();
const Ad = require("../models/ad");
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
  if (file.mimetype === "image/jpeg" || file.mimetype === "video/mp4") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 1024 * 1024 * 128 },
  fileFilter: fileFilter
}).single("ad");

router.post("/ad", (req, res) => {
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) return res.status(500).json(err);

    Ad.findOne({ name: req.body.name }).then(ad => {
      if (ad) return res.status(400).json({ name: " бүртгэгдсэн байна." });
      const newAd = new Ad({
        name: req.body.name,
        content: req.file.filename,
        link: req.body.link
      });
      newAd
        .save()
        .then(result => {
          res.status(200).json({
            result: result,
            message: "Амжилттай хадгалагдлаа."
          });
        })
        .catch(err => res.json({ error: err }));
    });
  });
});

router.get("/ad", (req, res) => {
  Banner.find()
    .select("name content link")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        ads: docs.map(doc => {
          return {
            name: doc.name,
            content: doc.content,
            link: doc.link
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

router.delete("/ad", (req, res) => {
  Ad.deleteOne({ name: req.body.name })
    .then(result => {
      const filepath = `${dir}${req.body.content}`;
      fs.unlinkSync(filepath);
      res.status(200).send(result);
    })
    .catch(err => {
      res.status(400).send(err);
      console.log(err);
    });
});

module.exports = router;
