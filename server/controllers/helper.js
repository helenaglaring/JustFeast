// Kilde: https://www.codementor.io/@olawalealadeusi896/building-a-simple-api-with-nodejs-expressjs-postgresql-db-and-jwt-3-mke10c5c5

/*----------------------------------- HJÆLPEFUNKTION------------------------------------------------------*/
// Importerer jsonwebtoken  og sætter variabel 'secret' der skal bruges til at generere en secret jwt token.
const jwt = require('jsonwebtoken');
const secret = 'verysecret';

// Hjælpefunktion til at generere jwt-token i userControllers. Skal sikre at user_id bliver kryptiseret inden
// det gemmes i session.

module.exports = {
    /**
     * Gnerate Token
     * @param {string} id
     * @returns {string} token
     */
    generateToken(id) {
        const token = jwt.sign({user_id: id}, secret
        );
        // Returnerer token så det kan tilgås
        return token;
    }

};
