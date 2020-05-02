// LinjeitemGET.js
const LineItem = require('../models/LineItem');

//const Product = require('../models/Product.js');

module.exports = (req,res)=> {
    // We try to find all products created in the database
    //const products = Product.find({});
    console.log(JSON.stringify(req.session.lineItems));
    let lineItems = new LineItem(req.session.lineItems ? req.session.lineItems: {});


    // Now we respond with the page creating all our products from our database.
    res.render('lineItems',{
        products: lineItems.generateArray(),
        totalPrice: lineItems.totalPrice
    });
};


//lineItemREMOVE.js
const Product = require('../models/Product');
const LineItem = require('../models/LineItem');


module.exports = (req, res)=> {
    let productId = req.params.id;
    let lineItems = new LineItem(req.session.lineItems ? req.session.lineItems: {});

    if (!req.session.lineItems) {
        req.flash('error','Kan ikke fjerne produkt. Du har ingen varer i kurven.')
        res.redirect('/products');
    } else {
        Product.findById(productId)
            .then(function(product) {
                // console.log(product);
                lineItems.remove(product, product.product_id, req.session.order.order_id);
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


};


// LineItem.STORE
const Product = require('../models/Product');
const LineItem = require('../models/LineItem');


module.exports = (req, res)=> {
    let productId = req.params.id;
    let lineItems = new LineItem(req.session.lineItems ? req.session.lineItems: {});

    Product.findById(productId)
        .then(function(product) {
            lineItems.add(product, product.product_id, req.session.order.order_id);
            req.session.lineItems = lineItems;
            console.log( "Lineitem Tilføjet. Nuværende kurv; " );
            console.log(req.session.lineItems);
            res.redirect('/products');
        })
        .catch(function(err) {
            console.log(err);
        })
};



/// deliveryMehtodGET
/*----------------------------------- Delivery ------------------------------------------------------*/


module.exports = (req,res) => {

    res.render('delivery', {
        title: 'Delivery-method page',
        messages: {
            success: req.flash('success'),
            error: req.flash('error')
        }
    })
};



// deliveryMethodController


const DeliveryMethod = require('../models/DeliveryMethod.js');

// POST route for delivery-page
module.exports = (req, res) => {

    DeliveryMethod.create(req.body, req.session.order.order_id)
        .then(result => {
            console.log(result);
            req.session.delivery = result;
            if (result.delivery) {
                console.log("Levering er valgt ");
                console.log("Levering registreret: ");
                console.log(req.session.delivery );
                req.flash('success', "Leveringsmetode registreret: Levering.");
                res.redirect('delivery-address')
            } else {
                console.log("Afhentning er valgt ");
                req.flash('success', "Leveringsmetode registreret: Afhent selv din bestilling.");
                res.redirect('payment')
            }
        })
        .catch((err) => {
            console.log(err);
            req.flash('error', 'Noget gik galt');
            res.redirect('delivery-method');
        });
};
/*
router.post('/delivery-method',  function(req, res) {
    console.log("Delivery-method form requested: " + JSON.stringify(req.body));
    console.log("ORDER ID: " + req.session.order_id);
    let data = {
        order_id: req.session.order_id,
        delivery: req.body.delivery,
        delivery_time: req.body.selectedTime,
    };
    // Convert delivery to bool
    data.delivery = (data.delivery === 'true');
    console.log("delivery is converted to boolean expression: "+ data.delivery);

    pool.query(`
        INSERT INTO delivery (order_id, delivery, delivery_time)
        VALUES ($1, $2,$3)
        ON CONFLICT (order_id)
        DO UPDATE SET delivery=$2, delivery_time=$3
        RETURNING *`, [data.order_id, data.delivery, data.delivery_time])
        .then(result => {
            req.session.delivery = result;
            console.log("Levering registreret: ");
            console.log(req.session.delivery );
            res.redirect('delivery-address')
        })
        .catch((err) => {
            console.log(err)
        });

});*/


/*----------------------------------- Address ------------------------------------------------------*/

// GET route for address-page
module.exports = (req,res) => {

    res.render('delivery-address', {
        title: 'Delivery-address page',
        address: req.session.address ? req.session.address : false ,
        messages: {
            success: req.flash('success'),
            error: req.flash('error')
        }
    })
};



// GET route for address-page
/* Flyttet
router.get('/delivery-address', orderMiddle.deliveryTrue, function (req, res) { //middle: ,
    res.render('delivery-address', {
        title: 'Delivery-address page',
        address: req.session.address,
        messages: {
            success: req.flash('success'),
            error: req.flash('error')
        }
    })
});
*/



const Address = require('../models/Address.js');

// POST route for delivery-address
module.exports = (req, res) => {

    Address.create(req.body, req.session.delivery.delivery_id)
        .then(result => {
            console.log(result);
            req.session.deliveryAddress = result;
            req.flash('success', "Leveringsoplysninger er registreret");
            res.redirect('payment')
        })
        .catch((err) => {
            console.log(err);
            req.flash('error', 'Noget gik galt');
            res.redirect('delivery-address');
        });
};


/*----------------------------------- Payment ------------------------------------------------------*/
// GET route for payment-page

module.exports = (req,res) => {
    res.render('payment', {
        title: 'Payment',
        deliveryFee: req.session.deliveryFee,
        sumCartItems: req.session.sumCartItems,
        totalAmount: req.session.totalAmount,
        //cart: req.session.cart,
        messages: {
            success: req.flash('success'),
            error: req.flash('error')
        }
    })
};


// Paymentcontroller.js

const Payment = require('../models/Payment.js');
const Order = require('../models/Order.js');

// POST route for payment
module.exports = (req, res) => {

    Payment.create(req.session.order.order_id, req.session.user.user_id, req.session.lineItems.totalPrice)
        .then(result => {
            console.log(result);
            req.session.payment = result;
            console.log("Betaling bekrfætet:");
            console.log(req.session.payment);

        })
        .catch((err) => {
            console.log(err);
            req.flash('error', 'Noget gik helt  galt');
            res.redirect('payment');
        });

    Order.placeOrder(req.session.order)
        .then(result => {
            console.log(result);
            req.flash('success', "Tak for din betaling");
            req.session.lineItems = {};
            res.redirect('/order/' + req.session.order.order_id);
        })
        .catch((err) => {
            console.log(err);
            req.flash('error', 'Noget gik galt');
            res.redirect('payment');
        });
}

