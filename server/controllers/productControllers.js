/*----------------------------------- PRODUCT CONTROLLERS ------------------------------------------------------*/
const Product = require('../models/Product.js');
const LineItem = require('../models/LineItem.js');

//-- Loader produkter fra database og viser dem på productPage --//
module.exports = {

    productPage: (req, res) => {

        // Instantierer nyt objekt der fungerer som vores 'cart'. Skal bruges til at vise nuværende kurv i front-end.
        let lineItems = new LineItem(req.session.lineItems ? req.session.lineItems: {});
        // Sætter variabel totalPrice der holder kurvens samlede pris.
        let totalPrice = lineItems.totalPrice ? lineItems.totalPrice : 0;
        console.log("Current cart items: ");
        console.log(req.session.lineItems);

        // Finder alle produkter i databasen
        Product.findAll()
            .then(function (products) {
                // Responderer med siden der viser alle produkter i database, kundens nuværende kurv og samlede pris.
                res.render('productShow',{
                    title: 'Menu-cart',
                    products,
                    lineitems: lineItems.generateArray(),
                    totalPrice: totalPrice,
                    messages: {
                        success: req.flash('success'),
                        error: req.flash('error')
                    }
                })
            })
            .catch(function (err) {
                console.log(err);
                res.status(400).send(err);
            })
    },

}