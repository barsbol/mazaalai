const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AdSchema = new Schema({
  id: Number,
  name: { type: String, required: true },
  content: { type: String, required: true },
  link: { type: String, required: true }
});

module.exports = mongoose.model("Ad", AdSchema);
