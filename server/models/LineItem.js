// https://stackoverflow.com/questions/59174763/how-to-add-product-to-shopping-cart-with-nodejs-express-and-mongoose
// https://github.com/jmmostov/SkipTheLine/blob/master/models/LineItem.js

/*-----------------------------------LINEITEM MODEL---------------------------------------------*/

// Database-connection
const pool = require('../db/db');

// LineItem fungerer som vores 'cart'. Deklarer en constructor-funktion med de attributter som vores cart skal have.
// Tager et 'gammelt' cart-objekt som parameter. Hvis det eksisterer i forvejen instantieres et cart med de eksisterende værdier
// Hvis oldCart er et tomt objekt, sættes det til de tomme værdier.
module.exports = function cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.deliveryFee = oldCart.deliveryFee || 0;

    // Metode der tilføjer produkter til cart
    // Den gør at Qty bliver opdateret i stedet for bare at tilføje endnu et objekt med samme id.
    // Dette gøres ved at opdatere en persons lineItem hver gang ved hjælp af følgende funktion.
    this.add = function(product, id){

        let storedItem =  this.items[id];
        if (!storedItem){
            storedItem = this.items[id] = {product: product, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.product.product_price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.product.product_price;

    };

    // Metode der fjerner et lineitem fra cart ved at decrease Qty med 1.
    this.deleteOne = function(product, id) {
        this.items[id].qty--;
        this.items[id].price -= this.items[id].product.product_price;
        this.totalQty--;
        this.totalPrice -= this.items[id].product.product_price;
        // Hvis antallet af det specifikke lineitem er <=0 fjernes det helt fra this.items.
        if(this.items[id].qty <= 0) {
            delete this.items[id];
        }
    };

    // Metode der sletter alle lineitems med givent product_id.
    this.deleteAll = function(id) {
        this.totalQty -=this.items[id].qty;
        this.totalPrice -=this.items[id].price;
        delete this.items[id];
        console.log("Alle lineitems af dette produkt fjernet fra kurv. ");
    };

    // Metode der opretter array med alle lineitems i this.items-objektet.
    // Bruges til at vise de lineitems der er i nuværende kurv til klienten.
    this.generateArray = function () {
        let arr = [];
        for (let id in this.items){
            arr.push(this.items[id]);
        }
        return arr
    };

    // Metode der tilføjer deliveryFee. Bruges når kunde submitter delivery-method form.
    this.addDeliveryFee = function () { // Sikrer at deliveryFee ikke tilføjes flere gange
        if (this.deliveryFee <= 0) {
            this.deliveryFee = 45;
            this.totalPrice += this.deliveryFee; // Tilføjer deliveryFee oven i ordren
            console.log("Leveringsgebyr på 45 kr. er tilføjet.");
        }
    };

    //Metode der gemmer de lineitems kunde har lagt i kurv i db når kunden accepterer sin betaling.
    this.createOrder = function (order_id) {
        // Bruger for-loop til at iterere gennem de forskellige produkt-typer i items, og for hver indsætte de givne værdier i lineitems-tabel.
        for ( let id in this.items) {
            pool.query(`
                INSERT INTO lineitem (product_id, order_id, qty, lineitem_price)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (product_id, order_id)
                DO UPDATE SET qty = $3
                RETURNING *
    `, [this.items[id].product.product_id, order_id, this.items[id].qty, this.items[id].product.product_price])
                .then(result => {
                    console.log("LineItems gemt i database: ");
                    console.log(result.rows[0]); // Rækker for hver lineitem-type.
                });
        }
    }
};




/*Oprindelig
// When ever we recreate our lineItem in the this.add we pass our old lineItem into it.
module.exports = function lineItem(oldLineItems){
    this.items = oldLineItems.items || {};
    this.totalQty = oldLineItems.totalQty || 0;
    this.totalPrice = oldLineItems.totalPrice || 0;


    this.add = function(product, id, order_id){
        // Nu vil vi sørge for, at Qty bliver opdateret i stedet for bare at tilføje endnu et objekt med samme id.
        // Dette gøres ved at opdatere en persons lineItem hver gang ved hjælp af følende funktion.
        let storedItem =  this.items[id];
        if (!storedItem){
            storedItem = this.items[id] = {product: product, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.product.product_price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.product.product_price;

        pool.query(`
            INSERT INTO lineitem (product_id, order_id, qty, lineitem_price)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (product_id, order_id)
            DO UPDATE SET qty = $3
            RETURNING *
    `, [storedItem.product.product_id, order_id, storedItem.qty, storedItem.product.product_price])
            .then(result => {
                //res.json(result.rows[0]);
                console.log("Product tilføjet til kurv: ");
                console.log(result.rows[0]);
            });
    };

    this.remove = function(product, id, order_id){
        // Nu vil vi sørge for, at Qty bliver opdateret
        // Dette gøres ved at opdatere en persons lineItem hver gang ved hjælp af følende funktion.
        let storedItem =  this.items[id];
        //if (!storedItem){
         //   storedItem = this.items[id] = {product: product, qty: 0, price: 0};
       // }
        if (storedItem.qty===0 || this.totalQty ===0) {
            console.log("Ingen produkter kan fjernes, da de ikke er i kurv");
            return false;
        } else if (storedItem.qty===1) {
            storedItem = this.items[id] = {product: product, qty: 0, price: 0};
            this.totalQty--;
            this.totalPrice -= storedItem.product.product_price;
            pool.query(`
                DELETE FROM lineitem 
                WHERE product_id=$1 AND order_id=$2 
                RETURNING *`
                , [storedItem.product.product_id, order_id])
                .then(result => {
                    console.log("Product fjernet fra kurv. 0 tilbage: ");
                    console.log(result.rows[0]);
                });
        } else {
            storedItem.qty--;
            storedItem.price = storedItem.product.product_price * storedItem.qty;
            this.totalQty--;
            this.totalPrice -= storedItem.product.product_price;
            pool.query(`
                UPDATE lineitem 
                SET qty = $1
                WHERE product_id=$2 AND order_id=$3 
                RETURNING *`
                , [storedItem.qty, storedItem.product.product_id, order_id])
                .then(result => {
                    console.log("Et produkt fjernet.");
                    console.log(result.rows);
                })
                .catch((err) => console.log(err))
        }
    };


    this.gennerateArray = function () {
        let arr = [];
        for (let id in this.items){
            arr.push(this.items[id]);
        }
        return arr
    };
};
*/


/*
/////////////////////////// 2
// When ever we recreate our lineItem in the this.add we pass our old lineItem into it.
module.exports = function cart(oldCart){
    this.items = oldCart.items || {};
    this.totalQty = oldCart.totalQty || 0;
    this.totalPrice = oldCart.totalPrice || 0;
    this.deliveryFee = oldCart.deliveryFee || 0;


    this.add = function(product, id, order_id){
        // Nu vil vi sørge for, at Qty bliver opdateret i stedet for bare at tilføje endnu et objekt med samme id.
        // Dette gøres ved at opdatere en persons lineItem hver gang ved hjælp af følende funktion.
        let storedItem =  this.items[id];
        if (!storedItem){
            storedItem = this.items[id] = {product: product, qty: 0, price: 0};
        }
        storedItem.qty++;
        storedItem.price = storedItem.product.product_price * storedItem.qty;
        this.totalQty++;
        this.totalPrice += storedItem.product.product_price;
        console.log("Product tilføjet til kurv: ");


        pool.query(`
            INSERT INTO lineitem (product_id, order_id, qty, lineitem_price)
            VALUES ($1, $2, $3, $4)
            ON CONFLICT (product_id, order_id)
            DO UPDATE SET qty = $3
            RETURNING *
    `, [storedItem.product.product_id, order_id, storedItem.qty, storedItem.product.product_price])
            .then(result => {
                //res.json(result.rows[0]);
                console.log("Product tilføjet til kurv: ");
                console.log(result.rows[0]);
            });
    };

    this.deleteOne = function(product, id, order_id){
        // Nu vil vi sørge for, at Qty bliver opdateret
        // Dette gøres ved at opdatere en persons lineItem hver gang ved hjælp af følende funktion.
        let storedItem =  this.items[id];
        if (storedItem.qty===0 || this.totalQty ===0) {
            console.log("Ingen produkter kan fjernes, da de ikke er i kurv");
            return false;
        } else if (storedItem.qty===1) {
            storedItem = this.items[id] = {product: product, qty: 0, price: 0};
            this.totalQty--;
            this.totalPrice -= storedItem.product.product_price;
            console.log("Product fjernet fra kurv. 0 tilbage: ");

            pool.query(`
                DELETE FROM lineitem
                WHERE product_id=$1 AND order_id=$2
                RETURNING *`
                , [storedItem.product.product_id, order_id])
                .then(result => {
                    console.log("Product fjernet fra kurv. 0 tilbage: ");
                    console.log(result.rows[0]);
                });
        } else {
            storedItem.qty--;
            storedItem.price = storedItem.product.product_price * storedItem.qty;
            this.totalQty--;
            this.totalPrice -= storedItem.product.product_price;
            console.log("Et produkt fjernet.");

            pool.query(`
                UPDATE lineitem
                SET qty = $1
                WHERE product_id=$2 AND order_id=$3
                RETURNING *`
                , [storedItem.qty, storedItem.product.product_id, order_id])
                .then(result => {
                    console.log("Et produkt fjernet.");
                    console.log(result.rows);
                })
                .catch((err) => console.log(err))
        }
    };

    this.deleteAll = function(id, order_id) {
        this.totalQty -=this.items[id].qty;
        this.totalPrice -=this.items[id].price;
        delete this.items[id];
        console.log("Alle lineitems af dette produkt fjernet fra kurv. ");

        pool.query(`
                DELETE FROM lineitem
                WHERE product_id=$1 AND order_id=$2
                RETURNING *`
            , [id, order_id])
            .then(result => {
                console.log("Alle lineitems af dette produkt fjernet fra kurv. ");
                console.log(result.rows[0]);
            });
    };


    this.generateArray = function () {
        let arr = [];
        for (let id in this.items){
            arr.push(this.items[id]);
        }
        return arr
    };


    this.create = function (order_id) {
        for ( let id in this.items) {
            pool.query(`
                INSERT INTO lineitem (product_id, order_id, qty, lineitem_price)
                VALUES ($1, $2, $3, $4)
                ON CONFLICT (product_id, order_id)
                DO UPDATE SET qty = $3
                RETURNING *
    `, [this.items[id].product.product_id, order_id, this.items[id].qty, this.items[id].product.product_price])
                .then(result => {
                    //res.json(result.rows[0]);
                    console.log("LineItems gemt i database: ");
                    console.log(result.rows[0]);
                });
        }
    }
};
*/