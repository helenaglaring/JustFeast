/*-----------------------------------PAYMENT MODEL---------------------------------------------*/

// Database-connection
const pool = require('../db/db');

module.exports = {
    // Funktion der indsætter payment-oplysninger i payment-tabel når kunde submitter valideret form.
    //
    create: function (order_id, user_id, totalAmount) {
        return new Promise((resolve, reject) => {
            pool.query(`
                   INSERT INTO payment (order_id, user_id, amount)
                    VALUES ($1, $2, $3)`
                , [order_id, user_id, totalAmount])

                .then(result => {
                    // Returnerer den indsatte record.
                    resolve(result.rows[0]);

                })
                .catch((err) => {
                    reject(err);
                    console.log(err)
                });
        });
    },

    // Funktion der finder specifik record i payment-tabel med givent order_id.
    // Bruges i checkPayment middleware til at undersøge, om der allerede er en betaling knytttet til denne ordre.
    findOne: function(orderID) {
        return new Promise((resolve, reject) =>{
            pool.query('SELECT * FROM payment WHERE order_id = $1', [orderID])
                .then(function(result) {
                    if (result.rows[0]) {
                        resolve({isTrue: true});
                        console.log("Der er betalt")
                    }
                    else {
                        resolve({isTrue: false});
                        console.log("Der er ikke betalt")
                    }
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }

};


/*
findOne: function(data) {
    return new Promise((resolve, reject)  =>{
        findOneById(data.order_id)
            .then( (result) => {
                resolve(result)
            })
            .catch( (err) =>  {
                reject(err);
                console.log(err)
            });
    })
}*/
/*

function findOneById(id) {
    return new Promise((resolve, reject) =>{
        pool.query('SELECT * FROM payment WHERE order_id = $1', [id])
            .then(function(result) {
                if (result.rows[0]) {
                    resolve({isTrue: true});
                    console.log("Der er betalt")
                }
                else {
                    resolve({isTrue: false});
                    console.log("Der er ikke betalt")
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
}
*/



