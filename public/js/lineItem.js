
/*--lineItem.js--------------------------SENDING REQUESTS VIA FETCH -----------------------------------------------------*/

console.log("lineitem.js");

// FETCH PUT request der tilføjer ét lineitem til cart
const addBtns = document.querySelectorAll('.addLineItem');
function addLineItem () {
    addBtns.forEach(addBtn => {
        addBtn.addEventListener('click', event => {
            event.preventDefault();
            console.log("Eventlistener submit");
            let product_id = addBtn.id;
            console.log(product_id);

            fetch('/lineitems/add/'+ product_id, {
                method: 'PUT'
            })
                .then(json => {
                    location.reload()
                })
        });
    })
};
addLineItem();

// FETCH PUT request der sletter ét lineitem fra cart
const removeBtns = document.querySelectorAll('.removeLineItem');
function removeLineItem () {
    removeBtns.forEach(removeBtn => {
        removeBtn.addEventListener('click', event => {
            event.preventDefault();
            console.log("Eventlistener submit");
            let product_id = removeBtn.id;
            console.log(product_id);

            fetch('/lineitems/remove/'+ product_id, {
                method: 'PUT'
            })
                .then(json => {
                    location.reload()
                })
        });
    })
};
removeLineItem();


// FETCH DELETE request der sletter alle lineitems af specifik produkt-type fra cart
const delBtns = document.querySelectorAll('.deleteLineItems');
function deleteLineItems () {
    delBtns.forEach(deleteBtn => {
        deleteBtn.addEventListener('click', event => {
            event.preventDefault();
            console.log("Eventlistener submit");
            let product_id = deleteBtn.id;
            console.log(product_id);

            fetch('/lineitems/delete-all/'+ product_id, {
                method: 'DELETE'
            })
                .then(json => {
                    location.reload()
                })
        });
    })
};

deleteLineItems();
