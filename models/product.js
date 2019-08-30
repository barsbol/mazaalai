const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProductSchema = new Schema({
  id: Number,
  toner: { type: String, required: true },
  mark: { type: String, required: true },
  printer: { type: String, required: true },
  brand: { type: String, required: true },
  price: { type: Number, required: true },
  page: { type: Number, required: true },
  image: { type: String, required: true }
});

module.exports = mongoose.model("Product", ProductSchema);
