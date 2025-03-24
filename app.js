const express = require('express');
const path = require('node:path');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require("passport-local");
const { usersCreatePost, auth} = require('./controllers/userController');
const bcrypt = require('bcryptjs');
const pool = require('./db/pool');
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

app.get("/", (req, res) => {
    res.render("index", { user: req.user })
});
app.get("/sign-up", (req, res) => res.render("sign-up"));
app.post("/sign-up", usersCreatePost);


app.post(
    "/log-in",
    auth()
 );
 app.get("/log-out", (req, res) => {
    req.logOut((err) => {
        if(err){
            return next(err);
        }
        res.redirect("/");
    })
 })
app.listen(3000, () => console.log("server listening on port 3000!"))