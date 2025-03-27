const {body, validationResult} = require("express-validator");
const { insertUser, insertMessage, getMessages, getMembership, deleteMessage } = require("../db/query");
const passport = require('passport');
const LocalStrategy = require('passport-local');
const bcrypt = require('bcryptjs');
const pool = require("../db/pool");
const alphaErr = "must only contain letters.";
const lengthErr = "must be between 1 and 10 characters.";
const emailErr = "must be a valid format (should include '@')."
const passwordErr = "must have more than 8 characters";

const validateUser = [
    body("firstName").trim()
        .isAlpha().withMessage(`First name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`First name ${lengthErr}`),
    body("lastName").trim()
        .isAlpha().withMessage(`Last name ${alphaErr}`)
        .isLength({ min: 1, max: 10 }).withMessage(`Last name ${lengthErr}`),
    body("email").trim()
        .isEmail().withMessage(`email ${emailErr}`),
    body("password").trim()
    .isLength({min: 8, max: 20}).withMessage(`password ${passwordErr}`),
    body('confirm-password').custom((value, { req }) => {
        return value === req.body.password;
      }).withMessage("Both passwords must match"),
]

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    }, async (email, password, done) => {
        try {
            const {rows} = await pool.query("SELECT * FROM members WHERE email = $1", [email]);
            const user = rows[0];

            if(!user){
                return done(null, false, {message: "user not found"});
            }
            const match = await bcrypt.compare(password, user.password);
            if (!match){
                return done(null, false, {message: "password is incorrect"});
            }
            return done(null, user);
        } catch(err) {
            return done(err)
        }
    })
);

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try{
        const { rows } = await pool.query("SELECT * FROM members WHERE id = $1", [id]);
        const user = rows[0];
        done(null, user);
    } catch(err){
        done(err);
    }
});

exports.getIndex = async (req, res) => {
    const {rows} = await getMessages();
    const options = 
         {
            weekday: 'short',
            month: 'short',
            day: 'numeric',
            year: 'numeric' 
         }
    const formattedDate = new Intl.DateTimeFormat('en-US', options).format(rows.date);
    const failedAttempt = req.session.failedAttempt ?? false
    res.render("index", {user: req.user, messages: rows, parsedDate: formattedDate, failedAttempt: failedAttempt})
}
exports.auth = () => passport.authenticate("local", {
successRedirect: "/",
failureRedirect: "/"
})


exports.usersCreatePost = [
    validateUser,
    async (req, res, next) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).render("index", {
                errors: errors.array()
            });
        }
        try {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await insertUser(req.body.firstName, req.body.lastName, req.body.email, hashedPassword);
            res.render("index", {success: true} );
        }catch(err){
            return next(err);
        }
    }
];

exports.userMessagePost = async (req, res) => {
    await insertMessage(req.body.name, req.body.message, new Date(Date.now()))
    res.redirect("/");
}

exports.membershipPost = async(req,res) => {
    if(req.body.code === process.env.SECRET){
        await getMembership(req.body.email)
        res.redirect("/");
    }else{
        req.session.failedAttempt = true
        res.redirect("/");
    }
   
    
}
exports.messageDelete = async (req,res) => {
    await deleteMessage(req.body.message);
    res.redirect("/");
}