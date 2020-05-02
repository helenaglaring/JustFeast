/*-------------------------Middleware for user validation ------------------------------------------*/
// Kilde: https://dev.to/nedsoft/a-clean-approach-to-using-express-validator-8go


// Bruger express-validator til backend-validation af forms.
const { check, validationResult } = require('express-validator');

// Deklarerer signupValidationRules der tjekker om kunde har indtastet valide oplysninger under signup.
const signupValidationRules = () => {
    return [
        check('email', 'Invalid email').isEmail(), // email skal være en valid email
        check('first_name', 'Udfyld venlgist "Fornavn" ').trim().not().isEmpty(),
        check('last_name', 'Udfyld venlgist "Efternavn"').trim().not().isEmpty(),
        check('email', 'Udfyld venlgist en E-mail').trim().not().isEmpty(),
        check('password', 'Password skal være på mindst 4 karakterer').trim().isLength({min:4}),
        // End of post data validation
    ]
};

// Middleware funktion der tjekker om formen er valid eller om der er fejl
const signupValidate = (req, res, next) => {
    // Deklarerer variabel der samler errors fra express-validatoren,
    const errors = validationResult(req);
    // Fortsæt hvis ingen fejl
    if (errors.isEmpty()) {
        return next()
    }
    // Extracter fejl fra error-objektet så de kan vises som enkelte fejlbeskeder.
    let err_val_messages = errors.errors.map( (error) => {
        return error.msg;
    });
    req.flash('error', err_val_messages);

    // RENDERING loginpage with validation errors
    res.redirect('signup');
};


// Samme metode som ovenform for login-validation
const loginValidationRules = () => {
    return [
        check('email', 'Udfyld venlgist en E-mail').trim().not().isEmpty(),
        check('email', 'Invalid email').isEmail(),
        check('password', 'Indtast venligst et gyldigt password').trim().isLength({min:4}),
        // End of post data validation
    ]
};

const loginValidate = (req, res, next) => {
    const errors = validationResult(req);
    if (errors.isEmpty()) {
        return next();
    }
    // Extracter fejlbeskeder fra errors-objekt.
    let err_val_messages = errors.errors.map( (error) => {
        return error.msg;
    });
    req.flash('error', err_val_messages);

    // RENDERING loginpage with validation errors
    res.redirect('login');
};

module.exports = {
    signupValidationRules,
    signupValidate,
    loginValidationRules,
    loginValidate,
};

