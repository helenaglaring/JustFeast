/*-----------------------------------ADDRESS MODEL---------------------------------------------*/
// Database-connection
const pool = require('../db/db');

module.exports = {
    // Funktion der indsætter leveringsaddresse i database.
    // Addresse-objekt og delivery_id som argumenter
    create: function (data, delivery_id) {
        return new Promise( (resolve, reject)=> {
            pool.query(`
                INSERT INTO address (delivery_id, streetname, streetnumber, zipcode, city)
                VALUES ($1, $2, $3, $4, $5)
                ON CONFLICT (delivery_id)
                DO UPDATE SET streetname=$2, streetnumber=$3, zipcode=$4, city=$5
                RETURNING *`
            , [delivery_id, data.streetname, data.streetnumber, data.zipcode, data.city])
            .then(result => {
                // Returnere den indsatte række med addresse-oplysninger.
                resolve(result.rows[0]);
            })
            .catch((err) => {
                reject('Noget gik galt');
                console.log(err)
            });
        });
    },
/*
    // Funktion til at finde specifik addresse. Tager user-objekt som parameter.
    findOne: function(data) {
        return new Promise((resolve, reject)  =>{
            //Bruger funktionen 'finOneById', der tager user_id som argument.
            findOneById(data.user_id)
                .then( (result) => {
                    // Returnerer række med addresse-oplysninger fra specifik bruger.
                    resolve(result);
                })
                .catch( (err) =>  {
                    reject(err);
                });
        })
    }*/
};
/*
// Hjælpe-funktion der finder en brugers addresse fra user_id.
function findOneById(id) {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM address WHERE user_id = $1', [id])
            .then(function(result) {
                if (result.rows[0]) {
                    console.log(result.rows[0]);
                    resolve(result.rows[0]);
                }
                else {
                    reject("Ingen addresse fundet")
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
}*/
