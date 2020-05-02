/*----------------------------------- DELIVERY METHOD CONTROLLERS ------------------------------------------------------*/
const DeliveryMethod = require('../models/DeliveryMethod.js');
const Cart = require('../models/LineItem');

module.exports = {
    // Delivery-method page call: GET route for delivery-method page
    delivMethodPage: (req, res) => {
        res.render('delivery', {
            title: 'Delivery-method page',
            order: req.session.order,
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        })
    },

    // POST route for delivery-page
    create: (req, res) => {
        // Bruger create funktion fra DeliveryMethod-model til at gemme oplysninger i db.
        DeliveryMethod.create(req.body, req.session.order.order_id)
            .then(result => {
                console.log(result);

                // Opbevarer de oplysninger der er indsat i deliveryMethod-tabel i session
                req.session.delivery = result;

                // If-else statement der tjekker om delivery-field er sand, og om kunde har valgt levering.
                if (result.delivery) {
                    // Hvis true har kunde valgt levering.
                    console.log("Levering er valgt ");
                    console.log("Levering registreret: ");
                    console.log(req.session.delivery);

                    // Tilføjer leveringsgebyr ved at insantiere Cart-objekt og bruge addDeliveryFee-metoden.
                    let cart = new Cart(req.session.lineItems ? req.session.lineItems: {});
                    cart.addDeliveryFee();

                    // Gemmer det opdaterede cart i session så deliveryFee og totalPrice er opdateret.
                    req.session.lineItems = cart;
                    console.log(cart);

                    // Omdirigerer til leverings-addresse hvis kunde har valgt levering
                    req.flash('success', "Leveringsmetode registreret: Levering.");
                    res.redirect('/checkout/delivery-address')

                } else {
                    // Hvis delivery===false har kunde valgt afhentning. Intet leveringsgebyr.
                    // Omdirigeres direkte til payment-side.
                    console.log("Afhentning er valgt ");
                    req.flash('success', "Leveringsmetode registreret: Afhent selv din bestilling.");
                    res.redirect('/checkout/payment')
                }
            })
            .catch((err) => {
                console.log(err);
                req.flash('error', 'Noget gik galt');
                res.redirect('/checkout/delivery-method');
            });

    },

};



