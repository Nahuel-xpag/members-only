const express = require('express');
const path = require('node:path');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const { usersCreatePost } = require('./controllers/userController');
require('dotenv').config();

/*const pool = new Pool(
process.env.DBOPTIONS
)*/

const app = express();

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(session({ secret: process.env.SECRET, resave: false, saveUninitialized: false}));
app.use(passport.session());
app.use(express.urlencoded({extended: false}));

app.get("/", (req, res) => res.render("index"));
app.post("/sign-up", usersCreatePost);

app.listen(3000, () => console.log("App listening on port 3000!"))