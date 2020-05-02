/*----------------------------------- PAYMENT CONTROLLERS ------------------------------------------------------*/
const Payment = require('../models/Payment.js');
const Order = require('../models/Order.js');
const Cart = require('../models/LineItem.js');

module.exports = {
    // GET route for payment-page
    paymentPage: (req, res) => {
        res.render('payment', {
            title: 'Payment',
            cart: req.session.lineItems,
            order: req.session.order,
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        })
    },
    // POST route for payment
    // Bruger createfunktionen fra Product-modellen til at gemme betalingsoplysninger i db.
    create: (req, res) => {
        // Betaling oprettes ud fra order_id, user_id og totalAmount.
        Payment.create(req.session.order.order_id, req.session.user.user_id, req.session.lineItems.totalPrice)
            .then(result => {
                console.log(result);
                // Gemmer resultat i session så det kan tilgås senere
                req.session.payment = result;
                console.log("Betaling bekrfætet:");
                console.log(req.session.payment);

            })
            .catch((err) => {
                console.log(err);
                // Redirect ved fejl
                req.flash('error', 'Noget gik helt  galt');
                res.redirect('/checkout/payment');
            });

        // Hvis betaling bekræftes succesfuldt bruges placeOrder funktion fra Order-model til at
        // ændre ordrens status fra 'cart' til 'order'
        Order.placeOrder(req.session.order)
            .then(order => {
                // Returnerer den record der er blevet ændret i 'order'-tabellen.
                console.log("Order-status ændret fra 'cart' til 'ordre': ");
                console.log(order);

                // Gemmer lineitems i database ved at bruge createOrder-funktion.
                let cart = new Cart(req.session.lineItems ? req.session.lineItems: {});
                cart.createOrder(order.order_id);

                // Redirect til side der viser oplysninger fra specifik ordre ud fra order_id
                req.flash('success', "Tak for din betaling");
                req.session.lineItems = {};
                res.redirect('/order/' + req.session.order.order_id);
            })
            .catch((err) => {
                console.log(err);
                req.flash('error', 'Noget gik galt');
                res.redirect('payment');
            });
    },
};





