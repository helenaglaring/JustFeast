/*----------------------------------- ORDER CONTROLLERS ------------------------------------------------------*/
const Order = require('../models/Order.js');



// GET specific order
module.exports = {

    // Finder specifik ordre i db ud fra parameter givet i URL der består af order_id.
    findOne: (req, res) => {
        Order.findOne(req.params.id)
            .then(order => {
                // Opdaterer order i session til den opdaterede order der blev ændret i db.
                req.session.order = order;
                console.log(req.session.order);

                // Responderer med ordre-side der viser oplysninger fra den givne ordre.
                res.render('order', {
                    title: 'Order',
                    order: req.session.order,
                    messages: {
                        success: req.flash('success'),
                        error: req.flash('error')
                    }
                })
            })
            .catch((err) => {
                req.flash('error', err);
                res.redirect('/');
                console.log(err)
                }
            );
    },

    // DELETE metode. Funktion der sletter kundens nuværende kurv. HTTP-request sendes via FETCH fra front end
    deleteCart: (req, res) => {
        // Bruger funktionen delteOne fra Order-model. Parameteren er sendt som :id og er det nuværende order_id.
        Order.deleteOne(req.params.id)
            . then( result => {
                // Nulstiller order og lineItems i session da cart=order skal slettes.
                req.session.order = {};
                req.session.lineItems = {};
                req.flash('succes', 'Nuværende kurv er slettet: ');
                console.log(result);
                console.log("Nuværende kurv er slettet");

                // Fetch i frontend omdirigerer til homepage
                res.end();
            })
            .catch(err => {
            console.log(err)
        })
    }
};