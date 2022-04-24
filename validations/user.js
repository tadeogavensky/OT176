const {
    body,
    validationResult
} = require('express-validator');

const userValidator = {
    signup: [
        body('firstName').notEmpty().withMessage('You must complete the first name field').bail()
        .isAlpha().withMessage('The first name must contain only letters, not numbers').bail()
        .isLength({
            min: 2
        }).withMessage('The first name must have more than 2 characters'),

        body('lastName').notEmpty().withMessage('You must complete the last name field').bail()
        .isAlpha().withMessage('The last name must contain only letters, not numbers').bail()
        .isLength({
            min: 2
        }).withMessage('The last name must have more than 2 characters'),

        body('email').notEmpty().withMessage('You must complete the email field').bail()
        .isEmail().withMessage('The email must be valid'),

        body('password').notEmpty().withMessage('You must complete the password field').bail()
        .matches(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[\w~@#$%^&*+=`|{}:;!.?\"()\[\]-]{8,}$/)
        .withMessage('The password must have more than 8 characters, a number, an uppercase letter and a lowercase letter, and/or it can have some special character')
    ],
    login: [
        body('email').notEmpty().withMessage('You must complete the email field').bail()
        .isEmail().withMessage('The email must be valid'),

        body('password').notEmpty().withMessage('You must complete the password field').bail()
    ]
}


module.exports = userValidator;