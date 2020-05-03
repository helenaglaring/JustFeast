// Definerer router-objekt, som er en isoleret instans af middleware og routes.
const express = require('express');
const router = express.Router();

/*-----------------------------------Middleware----------------------------------------------*/
// Importerer middleware
const auth = require('../middleware/authentication');
const {
    signupValidationRules,
    signupValidate,
    loginValidationRules,
    loginValidate} = require('../middleware/user-validation.js');

/*-----------------------------------Controllers ---------------------------------------------*/
// Importerer alle controllers

const homeController = require('../controllers/homeController');

// USER
const userControllers = require('../controllers/userControllers');

// PRODUCTS
const productControllers = require('../controllers/productControllers');

// LINEITEM
const lineItemControllers = require('../controllers/lineItemControllers');

// DELIVERY-METHOD
const deliveryMethodControllers = require('../controllers/deliveryMethodControllers');

// DELIVERY-ADDRESS
const addressControllers = require('../controllers/addressControllers');

// PAYMENT
const paymentControllers = require('../controllers/paymentControllers');

// ORDER
const orderControllers = require('../controllers/orderControllers');


/*-------------------------Endpoints og route-handlers---------------------------------------*/


/*------------ INDEX-PAGE ---------------*/
// GET home page
router.get('/', homeController);


/*------------- SIGNUP ------------------*/
// GET route for signup page
router.get('/signup', auth.isNotLoggedIn, userControllers.signupPage);

// POST route for user signup
router.post('/signup',signupValidationRules(), signupValidate, userControllers.signup);


/*----------------------------------- LOGIN ------------------------------------------------------*/
// GET route for login page
router.get('/login', auth.isNotLoggedIn, userControllers.loginPage);
// POST route for user login
router.post('/login', loginValidationRules(), loginValidate, userControllers.login);


/*----------------------------------- USER ACCOUNT ------------------------------------------------------*/
// GET route for user account page
// Middleware: Tillader kun adgang hvis bruger er logget ind.
router.get('/account/:id', auth.isLoggedIn, userControllers.account);


/*-----------------------------------LOG OUT------------------------------------------------------*/
// GET route for user logout
// Middleware: Bruger kan kun logge ud, hvis denne allerede er logget ind.
router.get('/logout', auth.isLoggedIn, userControllers.logout);


/*-----------------------------------DELETE USER-----------------------------------------------------*/
// DELETE route for deleting user
// Middleware: Bruger skal være logget ind.
router.delete('/user/delete/:id', auth.isLoggedIn, userControllers.deleteUser);


/*----------------------------------- PRODUCTS -------------------------------------------------*/
// GET route for products page.
// Viser alle produkter fra databasen.
router.get('/products',  auth.isLoggedIn, auth.createCart, productControllers.productPage);//

/*-----------------------------------LINEITEMS ------------------------------------------------------*/

// PUT route for adding item to cart
router.put('/lineitems/add/:id', lineItemControllers.add);
// PUT route for removing one item from cart
router.put('/lineitems/remove/:id', lineItemControllers.deleteOne);
// DELETE route for deleting all of specific lineitem from cart
router.delete('/lineitems/delete-all/:id', lineItemControllers.deleteAll);


/*----------------------------------- DELIVERY ------------------------------------------------------*/
// GET route for delivery-page
router.get('/checkout/delivery-method', auth.cartNotEmpty, deliveryMethodControllers.delivMethodPage );

// POST route for delivery-method information
router.post('/checkout/delivery-method',  deliveryMethodControllers.create);



/*----------------------------------- DELIEVRY-ADDRESS ------------------------------------------------------*/
// GET route for delivery-address page
// Middleware: Kun hvis bruger har valgt 'levering'. Ellers redirectes til 'payment'.
router.get('/checkout/delivery-address', auth.deliveryTrue, addressControllers.addressPage);

// POST route for delivery-address information
router.post('/checkout/delivery-address', addressControllers.create );


/*----------------------------------- PAYMENT ------------------------------------------------------*/
// GET route for payment-page
router.get('/checkout/payment', paymentControllers.paymentPage);

// POST route for payment information
// Middleware: Tjekker om bruger allerede har betalt for ordren før.
router.post('/checkout/payment', auth.checkPayment, paymentControllers.create);


/*----------------------------------- ORDER ------------------------------------------------------*/
// GET specific order
router.get('/order/:id', orderControllers.findOne);

// DELETE specific order
router.delete('/cart/delete/:id', orderControllers.deleteCart);


// Eksporterer 'router' så den er tilgængelig i app.js
module.exports = router;
