const { MongoServerClosedError } = require("mongodb");
const { default: mongoose } = require("mongoose");
const mogoose =require("mongoose");
const passport = require("passport");

const userSchema = mongooseSchema({
      name: {
        type: String,
        required: true
      },
      email: {
        type: String,
        required: true,
        unique: true
      },
      password : {
        type: String,
        required: true,
        unique: true

      }

})

const userModelel("User", userSchema);