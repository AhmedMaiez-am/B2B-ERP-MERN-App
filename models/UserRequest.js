const mongoose = require("mongoose");
const UserRequestSchema = new mongoose.Schema({
  no: String,
  name: String,
  email: String,
  password: String,
  tel: String,
  address: String,
  genBusGroup: String,
  customerGroup: String,
  code_magasin: String,
  codeLivraison: String,
  codeTVA: String,
  paymentTerm: String,
  paymentCode: String
});
module.exports = UserRequest = mongoose.model("userRequest", UserRequestSchema);
