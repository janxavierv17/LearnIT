import fs from "fs";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import cookieParser from "cookie-parser"
import csrf from "csurf"
const morgan = require("morgan");
const dotenv = require("dotenv")
dotenv.config();

// Cross-Site Request Forgery Protection
const csrfProtection = csrf({cookie:true})

//Create express app
const app = express();

// Database
mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
    useCreateIndex:true,
}).then(()=> console.log("Connection to our DB has been established.")).catch(err=>console.log("Something went wrong: ",err))

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use(cookieParser())

// route
fs.readdirSync("./routes").map((r) => app.use("/api", require(`./routes/${r}`)));

// CSRF
// these line of code must be together >>
app.use(csrfProtection);
app.get("/api/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});
// << these line of code must be together 

// Port
const port = process.env.PORT || 8000
app.listen(port, () => console.log(`Our node.js server is running on port ${port}`))


/**
 * NPM Installs
 * npm install csurf   - Cross-Site Request Forgery
 * npm install cookieparser - required for CSRF
 * npm install express-jwt - Used for protected routes
 * npm install aws-sdk - AWS Simple Email Service
 * npm install nanoid - Generating a code for reset password.
 * npm install stripe query-string - For setting up our stripe.
 */