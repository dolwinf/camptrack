const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  pic: String
});

module.exports = mongoose.model("User", UserSchema);
