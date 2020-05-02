
/*--address.js--------------------------CLIENT SIDE VALIDATION-----------------------------------------------------*/

console.log("Test");
class Address {
    constructor(id, streetname, streetnumber, zipCode, city){
        this.id = id;
        this.streetname = streetname;
        this.streetnumber = streetnumber;
        this.zipCode = zipCode;
        this.city = city;
    }

    static registerAddress() {
        let streetname = document.getElementById("val_streetname").value;
        let streetnumber = document.getElementById("val_streetnumber").value;
        let zipCode = document.getElementById("val_zipcode").value;
        let city = document.getElementById("val_city").value;

        let paraAddrRegistered = document.getElementById("address-registered");
        let newAddressObj = new Address(null, streetname, streetnumber, zipCode, city);

        if (this.validateAddress() === false) {
            alert("Mangler oplysninger");
            console.log("Form not validated");
            return false;
        } else {
            // Fetch send post
            console.log("validated address-form");
            return true;

        }
    }

    static validateAddress() {
        let addrValid = true;
        let streetname = document.getElementById("val_streetname").value;
        let streetnumber = document.getElementById("val_streetnumber").value;
        let zipCode = document.getElementById("val_zipcode").value;
        let city = document.getElementById("val_city").value;

        // error messages
        let errStreetname = document.getElementById("err_streetname");
        let errStreetnumber = document.getElementById("err_streetnumber");
        let errZipCode = document.getElementById("err_zipcode");
        let errCity = document.getElementById("err_city");

        // Validation Streetname
        if (streetname === null || streetname === "" || streetname.trim()==="") {
            errStreetname.innerHTML = "Udfyld vejnavn";
            addrValid = false;
        } else {
            errStreetname.innerHTML = null;
        }

        // Validation Streetnumber
        if (streetnumber === null || streetnumber === "" || streetnumber.trim()==="") {
            errStreetnumber.innerHTML = "Udfyld husnummer";
            addrValid = false;
        } else {
            errStreetnumber.innerHTML = null;
        }

        // Validation zipCode
        if (zipCode === "" || zipCode === null || zipCode.trim()==="") {
            errZipCode.innerHTML = "Udfyld postnr.";
            addrValid = false;

            // Post nr. kan kun bestå af 4 cifre
        } else if (zipCode.length !== 4) {
            errZipCode.innerHTML = "Post nr. skal bestå af 4 cifre";
            addrValid = false;
        } else {
            errZipCode.innerHTML = null;
        }
        // Validation: by
        if (city === "" || city === null || city.trim()==="") {
            errCity.innerHTML = "Du skal udfylde by";
            addrValid = false;
            // Anvender not-operator på isNaN-funktionen der skal kontrollere at der ikke er indtastet et tal
            // !!!!virker ikke optimalt =>  KUN hvis der udelukkende indtastet et tal.
        } else if (!isNaN(city)) {
            errCity.innerHTML = "By kan ikke bestå af tal";
            addrValid = false;
        } else {
            errCity.innerHTML = null;
        }
        if (addrValid === false) {
            return false;
        } else {
            return true;
        }
    }
}

// Tilføjer eventlistener til submitknap for at sikre at der valideres fra klient-siden inden formen submittes.
const form = document.querySelector('form');
const addressForm = document.querySelector('#delAddressForm');

addressForm.addEventListener('submit', event=> {
        // Forhindrer 'default' så form ikke submittes når man klikker 'submit'
        event.preventDefault();
        console.log("Eventlistener submit");

        // Bruger if-else statement til at tjekke at de indtastede oplysninger er korrekte
        if (Address.registerAddress() === false) {
            console.log("fejl");
        } else {
            // Hvis metoden returnerer sand kan den validerede form submittes.
            form.submit()
        }
    }
);






/*
window.onload = function() {
    let streetname = document.getElementById("val_streetname");
    let streetnumber = document.getElementById("val_streetnumber");
    let zipCode = document.getElementById("val_zipcode");
    let city = document.getElementById("val_city");

    fetch('/order/delivery-address')
        .then(response => response.json())
        .then(json => {
            form.action = 􏰀/users/${json.id}􏰀;
            name.value = json.name;
        });

*/
/*FETCH

const formElem = document.getElementById('delAddressForm');

let formData = new FormData(formElem);
formData.forEach((value, key) => {
    console.log("key %s: value %s", key, value);
});


fetch('http://localhost:3000/order/delivery-address', {
    method: 'POST',
    body: formData,
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded',
    }
})
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', JSON.stringify(response)))

*/

