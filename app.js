const express = require('express');
const {Pool} = require('pg');
const path = require('node:path');
const passport = require('passport');
const session = require('express-session');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const pool = new Pool(
process.env.DBOPTIONS
)

const app = express();

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

