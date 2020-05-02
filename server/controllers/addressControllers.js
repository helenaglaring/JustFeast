/*----------------------------------- ADDRESS CONTROLLERS ------------------------------------------------------*/
const Address = require('../models/Address.js');

module.exports = {
    // GET route for address-page
    addressPage: (req, res) => {
        // Responderer med siden hvor kunde skal angive leveringsaddresseinformationer
        res.render('delivery-address', {
            title: 'Delivery-address page',
            order: req.session.order, // siden skal kunne tilgå værdier fra order-objekt i session
            address: req.session.deliveryAddress ? req.session.deliveryAddress : false, // Viser gemte addresse-oplysninger
            messages: {
                success: req.flash('success'),
                error: req.flash('error')
            }
        })
    },

    // POST route for delivery-address
    create: (req, res) => {
        // Bruger create funktion fra Address-model til at gemme addresse-oplysninger i db.
        Address.create(req.body, req.session.delivery.delivery_id)
            .then(result => {
                console.log("Leveringsoplysninger er registreret: ");
                console.log(result);

                // Opbevarer de indsatte addresseoplysninger i session
                req.session.deliveryAddress = result;
                req.flash('success', "Leveringsoplysninger er registreret");
                res.redirect('/checkout/payment')
            })
            .catch((err) => {
                // Omdirigerer ved fejl
                console.log(err);
                req.flash('error', 'Noget gik galt');
                res.redirect('/checkout/delivery-address');
            });
    },


};




