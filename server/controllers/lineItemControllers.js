/*----------------------------------- LINE ITEM CONTROLLERS ------------------------------------------------------*/

const Product = require('../models/Product');
const Cart = require('../models/LineItem');


module.exports = {
    // Tilføjer det valgte produkt til kundens lineItem, der fungerer som 'cart'/'kurv'

    add: (req, res) => {
        // Først deklareres id af det valgte produkt til en variabel. Dette id er blevet sendt via API (:id)
        let productId = req.params.id;
        // Instantierer et nyt Cart-objekt ud fra den eksisterende lineItems i session.
        // Hvis dette ikke eksisterer instantieres værdien til et tomt objekt.
        let lineItems = new Cart(req.session.lineItems ? req.session.lineItems: {});

        // Bruger findById fra Product-model til at kunne sætte product-attributten til det valgte produkt-objekt.
        Product.findById(productId)
            .then(function(product) {
                lineItems.add(product, product.product_id);
                req.session.lineItems = lineItems;
                console.log( "Lineitem Tilføjet. Nuværende kurv; " );
                console.log(req.session.lineItems);
                res.redirect('/products');
            })
            .catch(function(err) {
                console.log(err);
            })
    },

    // Fjerner ét stk. af det lineItem af den valgte produkt-type.
    deleteOne: (req, res) => {
        let productId = req.params.id;
        let lineItems = new Cart(req.session.lineItems ? req.session.lineItems: {});

        // Tjekker om der lineitems i kurven der kan fjernes.
        if (!req.session.lineItems) {
            // Ingen produkter i lineItems
            req.flash('error','Kan ikke fjerne produkt. Du har ingen varer i kurven.')
            res.redirect('/products');
        } else {
            Product.findById(productId)
                .then(function(product) {
                    // bruger deleteOne metoden til at fjerne lineitem
                    lineItems.deleteOne(product, product.product_id);
                    // opdaterer værdien af req.session.lineItems
                    req.session.lineItems = lineItems;
                    console.log( "Lineitem fjernet. Nuværende kurv; " );
                    console.log(req.session.lineItems);
                    res.redirect('/products');
                })
                .catch(function(err) {
                    req.flash(err);
                    console.log(err);
                })
        }
    },

    // Funktion der sletter alle lineitems af den givne produkt-type som kunden har i sin 'kurv'.
    deleteAll: (req, res) => {
        let productId = req.params.id;
        let lineItems = new Cart(req.session.lineItems ? req.session.lineItems: {});

        lineItems.deleteAll(productId);
        req.session.lineItems = lineItems;
        console.log( "Alle lineitems fjernet" );
        res.redirect('/products');
    },

};
