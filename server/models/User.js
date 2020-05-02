/*
JWT: https://github.com/timtamimi/node.js-passport.js-template/blob/master/lib/routes.js
https://www.js-tutorials.com/nodejs-tutorial/user-authentication-using-jwt-json-web-token-node-js/#

Model:
https://github.com/anthonynsimon/node-postgres-registration/blob/master/models/user.js
 */

/*-----------------------------------USER MODEL---------------------------------------------*/
// Database-connection
const pool = require('../db/db');
// Importerer bcrypt der bruges til password
const bcrypt = require('bcrypt');

module.exports = {
    // Funktion der opretter ny bruger og gemmer i databasen.
    // Argumentet er det objekt som bruger har sumbittet fra form og er valideret vha. user-validation middleware.
    create: function (data) {
        return new Promise(function (resolve, reject) {
            // Tjekker at email ikke allerede eksisterer i db
            uniqueEmail(data.email)
                .then(function() {
                    // Funktion der returnerer hashed-password.
                    return hashPassword(data.password);
                })
                .then(function(hash) {
                    // Indsætter bruger i db med værdier fra form og hashed-psw
                    console.log(hash);
                    return pool.query(` 
                   INSERT INTO "user" (first_name, last_name, _password, email)
                   VALUES ($1, $2, $3, $4)`, [data.first_name, data.last_name, hash, data.email]);
                })
                .then(function(result) {
                    // Returnerer user-record der lige er blevet sat ind i db
                    resolve(result.rows)
                })
                .catch(function(err) {
                    reject(err);
                })
        });
    },

    // Funktion der bruges til user-login. Argumentet er objekt submittet fra form.
    login: function(data) {
        return new Promise(function(resolve, reject) {
            // Tjekker email eksisterer i db
            findOneByEmail(data.email)
                .then(function(user) {
                    // Verificerer pw
                    return verifyPassword(data.password, user);
                })
                .then(function(result) {
                    // Returnerer svar der kan bruges til at tjekke om bruger er logget ind
                    resolve({ isAuthorized: result.isValid, id: result.id, user: result.user });
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    },

    // Finder specifik bruger i db ud fra user_id
    findOneById: function(id) {
        return new Promise(function(resolve, reject) {
            pool.query('SELECT * FROM "user" WHERE user_id = $1', [id])
                .then(function(result) {
                    if (result.rows[0]) {
                        resolve(result.rows[0]);
                    }
                    else {
                        reject("Ingen bruger fundet")
                    }
                })
                .catch(function(err) {
                    reject(err);
                });
        });
    },

    // Funktion der sletter user-record fra user-tabel ud fra specifikt user_id.
    // Bruges hvis bruger vil slette sin egen konto.
    deleteOne: function(userID) {
        return new Promise((resolve, reject) => {
            pool.query(`
                DELETE FROM "user"
                WHERE user_id=$1  RETURNING *`, [userID])
                .then( result => {
                    // Returnerer den record der er blevet slettet fra user-tabel
                    resolve(result.rows[0]);
                })
                .catch( err => {
                    reject(err);
                    console.log(err)
                });
        });
    },
};

// Hjælpe-funktion der tjekker om email allerede eksisterer i user-tabel. Tager email som argument.
function uniqueEmail(email) {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT user_id FROM "user" WHERE email = $1', [email])
            .then(function(result) {
                if (result.rows[0]) {

                    // Rejectes hvis email allerede eksisterer.
                    reject('Email eksisterer allerede.')
                }
                else {
                    // Resolve hvis email er unik.
                    resolve()
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
}
// Hjælpefunktion der bruger bcrypt til at hashe brugerens submittede password.
function hashPassword(password) {
    return new Promise(function(resolve, reject) {
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                reject(err);
            }
            else {
                bcrypt.hash(password, salt, function(err, hash) {
                    if (err) {
                        reject(err);
                    }
                    else {
                        // Resolver det hashede password.
                        resolve(hash);
                    }
                });
            }
        });
    });
}
// Hjælpefunktion der finder specifik user ud fra email.
// Bruges i login-funktion til at undersøge om bruger har indtastet korrekt email.
function findOneByEmail(email) {
    return new Promise(function(resolve, reject) {
        pool.query('SELECT * FROM "user" WHERE email = $1', [email])
            .then(function(result) {
                if (result.rows[0]) {
                    console.log("E-mail eksisterer");
                    console.log(result.rows[0]);
                    resolve(result.rows[0]);
                }
                else {
                    reject("E-mail eksisterer ikke")
                }
            })
            .catch(function(err) {
                reject(err);
            });
    });
}
// Funktion der verificerer password. Sammenligner det submittede password med det, der er gemt i user-tabel.
function verifyPassword(password, user) {
    console.log(password);
    console.log(user);
    console.log(user._password);
    return new Promise(function(resolve, reject) {
        bcrypt.compare(password, user._password)
            .then( (compareResult) => {
                // Resolver hvis password matcher
                if (compareResult) {
                    resolve({isValid: compareResult, id: user.user_id, user: user});
                } else {
                    // Rejectes hvis det indtastede password ikke stemmer overens med det i db.
                    reject('Forkert kodeord')
                }
            })
            .catch( (err) => {
                reject(err);
            });
    })
}