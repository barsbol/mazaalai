const express = require("express");
const router = express.Router();
const Product = require("../models/product");
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
}).single("product");

router.post("/product", (req, res) => {
  upload(req, res, err => {
    if (err instanceof multer.MulterError) {
      return res.status(500).json(err);
    } else if (err) return res.status(500).json(err);

    Product.findOne({ toner: req.body.toner, printer: req.body.printer }).then(
      product => {
        if (product)
          return res
            .status(400)
            .json({ message: "Бүтээгдэхүүн бүртгэгдсэн байна." });
        const newProduct = new Product({
          toner: req.body.toner,
          mark: req.body.mark,
          printer: req.body.printer,
          brand: req.body.brand,
          price: req.body.price,
          page: req.body.page,
          image: req.file.filename
        });
        newProduct
          .save()
          .then(result => {
            res.status(200).json({
              product: result,
              message: "Амжилттай хадгалагдлаа."
            });
          })
          .catch(err => res.json({ error: err }));
      }
    );
  });
});

router.get("/product", (req, res) => {
  Product.find()
    .select("toner mark printer brand price page image")
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            toner: doc.toner,
            mark: doc.mark,
            printer: doc.printer,
            brand: doc.brand,
            price: doc.price,
            page: doc.page,
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

router.delete("/product", (req, res) => {
  Product.deleteOne({ toner: req.body.toner })
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
