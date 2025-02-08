const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true // ✅ Email should be unique
      },
      password: {
        type: String,
        required: true // ✅ No need for `unique: true`
      }
});

module.exports = mongoose.model("User", userSchema);
