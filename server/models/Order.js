/*-----------------------------------ORDER MODEL---------------------------------------------*/

// Database-connection
const pool = require('../db/db');


module.exports = {
    // Funktion der opretter ny 'order'-record i order-tabel med status 'cart'.
    // Bruges til at oprette ny 'kurv' når kunde kommer ind på produkt-siden.
    createCart: function(userId) {
        return new Promise((resolve, reject) => {
            // Indsætter ny field med den givne kundes user_id.
            pool.query(`
                INSERT INTO "order" (user_id, status)
                VALUES ($1, 'cart') RETURNING *`, [userId])
                .then( result => {
                    resolve(result.rows[0]);
                })
                .catch( err => {
                    reject(err);
                    console.log(err)
                });
        });
    },

    // Funktion der sletter en order-record i databasen med status='cart' og det aktuelle order_id.
    // Bruges når kunde ønsker at slette sin kurv.
    deleteOne: function(orderId) {
        return new Promise((resolve, reject) => {
            pool.query(`
                DELETE FROM "order"
                WHERE order_id=$1 AND status='cart' RETURNING *`, [orderId])
                .then( result => {
                    resolve(result.rows[0]);
                })
                .catch( err => {
                    reject(err);
                    console.log(err)
                });
        });
    },

    // Funktion der ændrer ordre-status fra 'cart' til 'order' når kunde bekræfter betaling.
    placeOrder: function (data) {
        return new Promise(function (resolve, reject) {
            // Tjekker først at status er 'cart' for at sikre at kunde ikke betaler 2 gange.
            if (data.status === 'order') {
                reject('Du har allerede betalt for ordren. Ordre-status er "order"');
                // Opdaterer status til 'order' og sætter 'order_date' til DEFAULT.
            } else {
                pool.query(`
                    UPDATE "order"
                    SET order_date=DEFAULT, status='order'
                    WHERE order_id =$1
                    RETURNING * `, [data.order_id])
                    .then(result => {
                        resolve(result.rows[0]);
                    })
                    .catch((err) => {
                        reject(err);
                        console.log(err)
                    });
            }
        });
    },

    // Funktion der henter specifik ordre fra db ud fra givent user_id og med status 'cart'
    // Bruges i createCart middleware til at undersøge om den givne kunde allerede har en 'kurv
    findCartByUser: function(id) {
        return new Promise(function(resolve, reject) {
            pool.query( `SELECT * FROM "order" WHERE user_id = $1 AND status='cart'`, [id])
                .then(result => {
                    // Returnerer record fra 'order'-tabel som har det specifikke user_id.
                    resolve(result.rows[0]);
                })
                .catch( err =>  {
                    reject(err);
                });
        });
    },

    // Funktion der henter specifik ordre fra db ud fra order_id.
    // Bruges til at vise ordre-bekræftelse når kunde har gennemført betaling.
    findOne: function(orderID) {
        return new Promise(function(resolve, reject) {
            pool.query('SELECT * FROM "order" WHERE order_id = $1', [orderID])
                .then(function(result) {
                    if (result.rows[0]) {
                        console.log(result.rows[0]);
                        resolve(result.rows[0]);
                    }
                    // Ingen record med det givne order_id
                    else {
                        reject("Ingen ordre fundet")
                    }
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    },

};
/*

    findOne: function(id) {
        return new Promise((resolve, reject)  =>{
            findOneById(id)
                .then( (result) => {
                    resolve(result);
                })
                .catch( (err) =>  {
                    reject(err);
                });
        })
    },


function findOneById(id) {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM "order" WHERE order_id = $1', [id])
            .then(function(result) {
                if (result.rows[0]) {
                    console.log(result.rows[0]);
                    resolve(result.rows[0]);
                }
                else {
                    reject("Ingen ordre fundet")
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
}


    updateStatus: function (order) {
        return new Promise(function (resolve, reject) {
            if (!order.status === 'cart') {
                reject('Status af ordre er ikke "Pending"');
            } else {
                pool.query(`UPDATE "order" SET status='pending' WHERE order_id = $1 RETURNING status`
                    , [order.order_id])
                    .then(function () {
                        resolve('Ordre-status ændret fra "cart" til "pending"');
                    })
                    .catch(function (err) {
                        reject(err);
                        console.log(err)
                    });
            }
        });
    },
*  */