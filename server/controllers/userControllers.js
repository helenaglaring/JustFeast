// kilde: https://github.com/anthonynsimon/node-postgres-registration/blob/master/models/user.js

/*----------------------------------- USER CONTROLLERS  ------------------------------------------------------*/
const User = require('../models/User');
const Helper = require('./helper');
const Order = require('../models/Order');


module.exports = {
    // Signup page call: GET route for user signup
    signupPage: (req,res) => {
        res.render('user/signup', {
            title: 'Signup page',
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        })
    },

    // POST route for user signup
    signup: (req,res) => {
        // Opretter ny bruger ud fra valideret form-data.
        User.create(req.body)
            .then(function(result) {
                console.log(result);
                // Omdirigerer til login-side når bruger er succesfuldt oprettet.
                req.flash('success', "Bruger oprettet");
                res.redirect('login');
            })
            .catch(function(errors) {
                // Ved fejl og validation errors reloades siden med respektive fejlbeskeder.
                req.flash('error', errors);
                res.redirect('signup');
            });
    },


    // Login page call: GET route for user login
    loginPage: (req,res) => {
        res.render('user/login', {
            title: 'Login',
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        });
    },


    // POST route for user login
    login: (req, res) => {
        // Bruger login-funktion fra User-model til at logge bruger ind
        User.login(req.body)
            .then(function (result) {
                // Sætter user_id som JWT-token når bruger er logget ind
                const token = Helper.generateToken(result.id);
                res.cookie('jwt-token', token);

                // Gemmer logget ind user i session
                req.session.user = result.user;
                console.log("User-id obj:");
                console.log(req.session.user);
                console.log("User-id:");
                console.log(req.session.user.user_id);

                // Omdirigerer til user account side når bruger er logget succesfuldt ind
                req.flash('success', `Du er nu logget ind.`);
                res.redirect('account/' + result.user.user_id);
            })
            .catch(function (errors) {
                console.log(errors);
                req.flash('error', errors);
                // RENDERING loginpage med validation errors
                res.redirect('login');
            })
    },

    // Account page call: GET route for user account
    account: (req, res) => {
        User.findOneById(req.params.id)
            .then(user => {
                console.log(user);
                res.render('user/account', {
                    title: 'Account',
                    user: user,//req.session.user
                    messages: {
                        success: req.flash('success'),
                        error: req.flash('error')
                    }
                })
            })
            .catch(err => {
                console.log(err);
                req.flash('error', err);
                res.redirect('/');
            })
    },
    // GET route for user logout
    // Sletter også session
    logout: (req, res) => {
        // Når bruger logger ud skal den nuværende kurv (order med status 'cart') også slettes fra db.
        // Derfor bruges funktionen deleteOne der sletter order-record i order'tabel ud fra order_id.

        // Deklarerer værdien gemt i session.order i variablen "order", hvis ikke der er gemt noget
        // Er der endnu ikke oprettet en ordre til kundens 'cart' og derfor sættes værdien til et tomt objkt.
        let order = req.session.order ? req.session.order : {};

        // Bruger if-statement til at undersøge om der er oprettet en order med status som 'cart' i db.
        // Hvis order=== undefined er der endnu ikke oprettet et cart, og derfor kommer man ikke ind i if-statement
        if (!order === undefined) {
            // Sørger for at slette order med status 'kurv' i db hvis kunde logger ud inden at have gennemført ordre.
            console.log("Slet kurv" + order.order_id);
            Order.deleteOne(req.session.order.order_id)
                .then(result => {
                    console.log("Kurv slettes");
                    console.log(result);
                })
                .catch(err => console.log(err));
        }
        // Sletter jwt-token i cookies og session.
        res.clearCookie("jwt-token");
        req.flash('success', "Logged out. See you soon!");
        req.session.destroy((err) => {
            if(err) {
                return console.log(err);
            }
            console.log("Bruger er logget ud");
            res.redirect('login');
        });
    },

    // Slet bruger via user_id der sendes som param :id
    // DELETE request der sendes via fetch metode fra front end
    deleteUser: (req, res) => {
        User.deleteOne(req.params.id)
            . then( result => {
                console.log("Bruger slettet: ");
                console.log(result);

                // jwt-cookies og session skal også slettes når bruger slettes
                res.clearCookie("jwt-token");
                req.flash('success', "Bruger slettet");
                req.session.destroy((err) => {
                    if(err) {
                        return console.log(err);
                    }
                    // FETCH omdirigerer til homepage
                    res.end()
                });
            })
            .catch(err => {
                console.log(err)
            })
    }
};





