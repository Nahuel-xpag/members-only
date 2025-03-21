const express = require('express');
const {Pool} = require('pg');
const path = require('node:path');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
require('dotenv').config();

/*const pool = new Pool(
process.env.DBOPTIONS
)*/

const app = express();

const assetsPath = path.join(__dirname, "public");
app.use(express.static(assetsPath));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: true}));
app.get("/", (req, res) => res.render("index", {
messages: [
    {
    user: "username",
    body: "message body sample"
    },
    {
    user: "other user",
    body: "other body message sample" 
    }
]
}
));


app.listen(3000, () => console.log("App listening on port 3000!"))