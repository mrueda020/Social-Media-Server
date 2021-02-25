const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const model = mongoose.model;
const UserSchema = new Schema({
  username: String,
  email: String,
  password: String,
  createdAt: String,
});

module.exports = model("User", UserSchema);
