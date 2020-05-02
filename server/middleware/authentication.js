const jwt = require('jsonwebtoken');
const secret = 'verysecret';

// Importerer modeller
const User = require('../models/User');
const Order = require('../models/Order.js');
const Cart = require('../models/LineItem');
const DeliveryMethod = require('../models/DeliveryMethod.js');
const Payment = require('../models/Payment.js');

/*-------------------------Middleware for user authentication-------------------------------------------*/

//-- Check om bruger er logget ind --//
exports.isLoggedIn = function(req, res, next) {

    // Tjekker om cookies og jwt-token er sat. Hvis true er bruger logget ind.
    if(req.cookies && req.cookies['jwt-token']) {
        // Continue hvis bruger er logget ind
        // Verificerer token
        const decoded = jwt.verify(req.cookies['jwt-token'], secret);

        // Bruger det decodede user_id til at finde den specifikke bruger fra user-tabellen.
        User.findOneById(decoded.user_id)
            .then(user => {
                console.log("Bruger er logget ind med ID: " + user.user_id);
                req.session.user = user;
                next()
            })
            .catch(err => {
                console.log("Der er sket en fejl");
                console.log(err);
            })

    } else {
        // Bruger ikke logget ind. Redirect hvis ikke req.cookies og jwt-token er sat.
        req.flash('error', "Ingen bruger logget ind");
        console.log("Ingen bruger logget ind");
        res.redirect('/login');
    }
};

//--  Check om bruger ikke er logget ind --//
exports.isNotLoggedIn = function(req, res, next) {
    // Continue hvis ingen bruger er logget ind
    if(!req.session.user) {
        return next();
    }
    // Redirect til user account side hvis bruger allerede er logget ind.
    req.flash('error', 'Du er allerede logget ind som bruger: ' + req.session.user.first_name);
    res.redirect('account')
};



/*-------------------------------- Middleware for creating cart ------------------------------------------------------*/

//-- Create cart --//
// Middleware funktion der tjekker om der eksisterer en kurv med det specifikke user-id. Hvis ikke oprettes ny kurv.
exports.createCart = function(req, res, next) {
    // Find order-record i order-tabel med specifikt user_id
    Order.findCartByUser(req.session.user.user_id)
        .then(order => {
            // Ordre er allerede oprettet som 'cart'.
            if (order) {
                console.log("Cart er allerede oprettet med ordre-ID: " + order.order_id);
                console.log("Nuværende ordre: ");
                console.log(order);
                req.session.order = order;
                next();

            } else {
                // Opretter ny ordre med status som 'cart'. Gemmer nuværende cart i session.
                Order.createCart(req.session.user.user_id)
                    .then(cart => {
                        console.log(cart);
                        req.session.order = cart;
                        console.log("Cart er blevet oprettet med ordre-ID: " + req.session.order.order_id);
                        next()
                    })
                    .catch(err => {
                        console.log(err);
                    });
            }
        })
        .catch( err => {
            console.log(err);
            next();
        })
};


/*-------------------------Middleware for checkouts-------------------------------------------*/


/*---------Delivery-method middleware --------*/

//-- Middleware to GET delivery-method page, when user submits cart. Redirect if empty cart --//
exports.cartNotEmpty = function(req, res, next) {
    let lineItems = new Cart(req.session.lineItems ? req.session.lineItems : {});

    // Continue if there are line items in cart
    if(lineItems.totalQty===0) {
        console.log("Ingen produkter i kurven: " + lineItems.totalQty);
        // Redirect to cart index page if no items in cart
        req.flash('error', 'Du har ingen produkter i kurven');
        res.redirect('/products') // Redirect if not logged in
    } else {
        console.log("JUHU produkter i kurv - du kan fortsætte. Antal i kurv: " + lineItems.totalQty);
        return next();
    }
};


/*---------Address middleware -------
// Samme metode som nedenfor men bruger session istedet.
//-- Middleware to GET address page. Only if user has selected "delivery"--//
exports.deliveryTrue = function(req, res, next) {
    // Hvis levering er valgt indlæses siden hvor leveringsoplysninger skal læses
    if(req.session.delivery.delivery) {
        return next();
    }
    // Hvis ikke bruger har valgt levering sendes direkte videre til betaling
    res.redirect('payment') // Redirect if not logged in
};
-*/

//-- Middleware til GET delivery-address page. Kun hvis bruger har valgt levering "delivery"--//
exports.deliveryTrue = function(req, res, next) {
    // Bruger funktion fra DeliveryMethod-model, der returnerer 'delivery'-field fra record gemt i db.
    DeliveryMethod.findOne(req.session.order.order_id)
        .then(delivery=> {
            // Hvis delivery=true indlæses siden for leveringsaddresseoplysninger .
            if (delivery) {
                return next()
            } else {
                // Hvis kunde tilgår siden uden at have valgt levering vises fejlbesked og omdirigeres til payment.
                req.flash('error', 'Du har ikke valgt levering og skal derfor ikke angive leveringsoplysninger');
                res.redirect('payment')
            }
        })
        .catch(err => {
            console.log(err);
        })
};



/*---------Payment middleware --------*/
//-- Checking if payment already has been made --//
exports.checkPayment = function (req, res, next)  {
    Payment.findOne(req.session.order.order_id)
        .then(payment => {
            // Check if payment already has been made
            if (payment.isTrue === true) {
                req.flash('error', 'Du har allerede betalt');
                res.redirect('/order/' + req.session.order.order_id);
            }
            // Continue if no payment hasn't been made yet
            else {
                next()
            }
        })
        .catch( (err) => {
            console.log(err);
            req.flash('error', 'noget gik galt');
            res.redirect('payment');
        });
};

