const mongoose = require("mongoose");
const ArticleSchema = new mongoose.Schema({
  num: Number,
  description: String,
  stocks: Number,
  numGamme: Number,
  prixUni: Number,
  numFrounisseur: Number
});

module.exports = User = mongoose.model("article", ArticleSchema);
