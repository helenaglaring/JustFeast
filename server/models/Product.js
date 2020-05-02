/*-----------------------------------PRODUCT MODEL---------------------------------------------*/
// Database-connection
const pool = require('../db/db');


module.exports = {
    // Funktion der henter alle produkter fra db
    // Bruges til at vide produkter i front-end.
    findAll: function () {
        return new Promise(function (resolve, reject) {
            pool.query('SELECT * FROM product')
                .then(function (results) {
                   // Returnerer alle records i product-tabel.
                    resolve(results.rows);
                })
                .catch(function (err) {
                    reject(err);
                    console.log(err);
                });
        });
    },

    // Funktion der henter specifikt produkt fra db ud fra produkt_id
    // Bruges i LineItems-metoder til at knytte lineitems-product_id sammen med product_id.
    findById: function(id) {
        return new Promise(function(resolve, reject) {
            pool.query('SELECT * FROM product WHERE product_id = $1', [id])
                .then(function(result) {
                    if (result.rows[0]) {
                        console.log("Det valgte produkt:");
                        console.log(result.rows[0]);
                        resolve(result.rows[0]);
                    }
                    else {
                        reject('no lineitems found');
                    }
                })
                .catch(function(err) {
                    reject(err);
                    console.log(err);
                });
        });
    },
};


