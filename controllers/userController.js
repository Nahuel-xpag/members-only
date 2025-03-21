const {body, validationResult} = require("express-validator");
const { insertUser } = require("../db/query");
const bcrypt = require('bcryptjs');
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
/*exports.usersCreateGet = (req, res) => {
    res.render("createUser", {
        title: "Create user",
    });
};
*/

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