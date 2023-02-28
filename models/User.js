const mongoose = require("mongoose");
const UserSchema = new mongoose.Schema({
  lastname: String,
  firstname: String,
  email: String,
  password: String,
  tel: Number,
  entreprise: String
});
module.exports = User = mongoose.model("user", UserSchema);
