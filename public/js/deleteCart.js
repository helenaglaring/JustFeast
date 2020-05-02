console.log("test");

/*--deleteCart.js--------------------------FETCH DELETE REQUEST-----------------------------------------------------*/

//This constant gets the element from the delete button in the ejs file "delete-cart"
// that is included in "delivery-method, delivery-address and payment".
const delBtn = document.querySelector('.deleteCart');

// Funktionen tilføjer eventlistener til deleteCart-knappen.
// Efterfølgende fetch'er vi  API kaldet: cart/delete/:id
// Den bruger DELETE-metoden og redirecter til account-siden

function deleteCart () {
    // Tilføjer eventlistener der lytter på 'click' til button
    delBtn.addEventListener('click', event => {
        event.preventDefault();
        console.log("Eventlistener submit");
        // Deklarerer variabel der holder værdien af det nuværende order_id. Dette er sat som id-attribut i ejs-templaten.
        let order_id = delBtn.id;
        console.log(order_id);

        fetch('/cart/delete/'+ order_id, {
            method: 'DELETE'
        })
            .then( json => {
            location.href = "http://localhost:3000/account";
        })
    });

};

deleteCart();