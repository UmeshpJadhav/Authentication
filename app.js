const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const connectDB = require("./config/mogoose-connection");

connectDB();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use("/api/auth", authRoutes);




app.listen(3000);

