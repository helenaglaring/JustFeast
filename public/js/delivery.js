
/*--delivery.js--------------------------CLIENT SIDE VALIDATION-----------------------------------------------------*/

console.log("hej")

class Delivery {
    constructor(delivery, deliveryTime) {
        this.delivery = delivery;
        this.deliveryTime = deliveryTime;
    }

    static registerDelivery() {
        let paraDelRegistered = document.getElementById("delivery-registered");
        let deliverySelected = document.getElementById("yes-delivery");
        let pickupSelected = document.getElementById("no-delivery");
        let time = document.getElementById("selectedTime");
        let delTime = time.value;

        let deliveryMethod;

        if (deliverySelected.checked === true) {
            deliveryMethod = true;
        } else if (pickupSelected.checked === true) {
            deliveryMethod = false;
        }

        let newDelObj = new Delivery(deliveryMethod, delTime);

        if (this.validateDeliveryInformation() === false) {
            alert("Mangler oplysninger");
            return false;
        } else {
            console.log(newDelObj);
            console.log("Leveringsoplysninger valideret");
            return true;
        }
    }

    static validateDeliveryInformation() {
        let time = document.getElementById("selectedTime");
        let errDelMethod = document.getElementById("err_del_method");
        let errDelTime = document.getElementById("err_del_time");
        let valDelInfo = false;

        // Variabel bindes til DOM-element for paragraf, hvor meddelelse vises, når levering er registreret korrekt. /HG
        let paraDelRegistered = document.getElementById("delivery-registered");

        let delRadioBtn = document.querySelectorAll("[name=delivery]");
        let len = delRadioBtn.length;
        let radioInput = false;

        // Validation af leveringsmetode
        for (let i = 0; i < len; i++) {
            if (delRadioBtn[i].checked) {
                 radioInput = true;
            }
        }
        // if-else statement der anvender boolean værdi til at kontrollere om radiobtn er blevet checked.
        // Hvis false er ingen radiobutton blevet valgt.
        // Hvis leveringsmetode er valgt og radioInput er true skrives der ingen fejlmeddelelse i HTML-dokument. /HG
        if (radioInput === false) {
            errDelMethod.innerHTML = "Vælg leveringsmetode";
            console.log("vælg leveringsmetode");
            valDelInfo = false;
            return false;

        } else {
            errDelMethod.innerHTML = null;
            valDelInfo = true;
            return true;

        }

        // Validation: Leverings/afhentningstid
        if (time.value == '') {
            errDelTime.innerHTML = "Vælg gyldigt leverings/afhentningstidspunkt";
            valDelInfo = false;
            return false;

        } else {
            errDelTime.innerHTML = null;
            valDelInfo = true;
            return true;

        }
        if (valDelInfo === true) {
            console.log("Deliverymethod form valideret");
            console.log(valDelInfo);
            return true;

        } else {
            alert("Mangler oplysninger");
            console.log("Deliverymethod form IKKE valideret");
            return false;

        }
    }
}

// Tilføjer eventlistener til submitknap for at sikre at der valideres fra klient-siden inden formen submittes.
const form = document.querySelector('form');
const deliveryForm = document.querySelector('#deliveryForm');

deliveryForm.addEventListener('submit', event=> {
        event.preventDefault();
        console.log("Eventlistener submit");

        if (Delivery.registerDelivery() === false) {
            console.log("fejl");

        } else {

            form.submit()
        }
    }
);







/*
FETCH
const formElem = document.getElementById('deliveryForm');

let formData = new FormData(formElem);
formData.append('selectedTime', newDelObj.deliveryTime)
//formData.append('delivery_method', newDelObj.delivery);
//formData.append('delivery_time', newDelObj.deliveryTime);
console.log(JSON.stringify(formData));

fetch('http://localhost:3000/order/delivery-method', {
    method: 'POST',
    body: formData,
    headers:{
        'Content-Type': 'application/x-www-form-urlencoded'
    }
})
    .then(response => response.json())
    .catch(error => console.error('Error:', error))
    .then(response => console.log('Success:', JSON.stringify(response)))

 */