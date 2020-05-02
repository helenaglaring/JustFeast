/*-----------------------------------DELIVERY-METHOD MODEL---------------------------------------------*/
// Database-connection
const pool = require('../db/db');


module.exports = {
    // Funktion der indsætter delivery-method oplysninger i database, når bruger submitter valideret form.
    // Tager objekt med værdier og order_id som parameter.
    create: function (data, order_id) {
        return new Promise(function (resolve, reject) {
            // Konverterer 'delivery' til bool da det er den påkrævede data-type.
            data.delivery = (data.delivery === 'true');
            console.log("delivery is converted to boolean expression: "+ data.delivery);

            //Indsætter oplysninger i 'delivery'-tabel.
            pool.query(`
                INSERT INTO delivery (order_id, delivery, delivery_time)
                VALUES ($1, $2,$3)
                ON CONFLICT (order_id)
                DO UPDATE SET delivery=$2, delivery_time=$3
                RETURNING *`
                , [order_id, data.delivery, data.selectedTime])

            .then(result => {
                // Returnerer række med de indsatte oplysninger.
                resolve(result.rows[0]);

            })
            .catch((err) => {
                reject(err);
                console.log(err)
            });

        });
    },

    // Funktion der henter leveringsmetode-info fra db ud specifikt order-id.
    // Bruges i deliveryTrue-middlewarefunktion, så kunde ikke kan tilgå delivery-address-page hvis delivery=false.
    findOne: function(id) {
        return new Promise(function(resolve, reject) {
            // Finder record i db ud fra det order_id der er parset som argument.
            pool.query('SELECT * FROM delivery WHERE order_id = $1', [id])
                .then(function(result) {
                    if (result.rows[0]) {
                        console.log(result.rows[0]);
                        // Returnerer delivery-attribut, som er en bool. Skal bruges til at finde ud af om delivery=true eller false.
                        resolve(result.rows[0].delivery);
                    }
                    else {
                        reject("Ingen oplysninger fundet")
                    }
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    }
};

/*
    // Funktion der henter leveringsmetode-info fra db ud specifikt order-objekt.
    findOne: function(data) {
        return new Promise((resolve, reject)  =>{
            // Finder række i db ud fra order_id
            findOneById(data.order_id)
                .then( (result) => {
                    // Returnerer delivery-attribut, som er en bool. Skal bruges til at finde ud af om delivery=true eller false.
                    resolve(result.delivery);
                    console.log(result)
                })
                .catch( (err) =>  {
                    reject(err);
                });
        })
    }
// Funktion der henter leveringsmetode-info fra db ud specifikt order-id.
function findOneById(id) {
    return new Promise(function(resolve, reject) {
        // Finder record i db med order_id givet som parameter
        pool.query('SELECT * FROM delivery WHERE order_id = $1', [id])
            .then(function(result) {
                if (result.rows[0]) {
                    // Returnerer delivery-attribut, som er en bool. Skal bruges til at finde ud af om delivery=true eller false.
                    resolve(result.rows[0]);
                }
                else {
                    reject("Ingen oplysninger fundet")
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
} */