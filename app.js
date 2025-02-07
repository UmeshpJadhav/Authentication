const express = require("express");
const app = express();
const authRouter = require("./routes/auth");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const connectDB = require("./config/mogoose-connection");

connectDB();


app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(cookieParser());


app.use("/api/auth", authRouter);




app.listen(3000);

