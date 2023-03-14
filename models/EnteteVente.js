const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const EnteteVenteSchema = new mongoose.Schema({
  num: String,
  type: String
});

module.exports = mongoose.model("enteteVente", EnteteVenteSchema);
