
/*--payment.js--------------------------CLIENT SIDE VALIDATION-----------------------------------------------------*/

console.log("payment.js");


// Formålet med at oprette en klasse er at definere hvilke informationer en "betaling" består af
// Klassen er ud fra en constructor givet 6 parametre der synes relevante for den ønskede funktion i programmet MB
class Payment {
    constructor(cardNumber,expiryDateMonth,expiryDateYear,CVC,cardHoldersName,paymentID) {
        this.cardNumber = cardNumber;
        this.expiryDateMonth = expiryDateMonth;
        this.expiryDateYear = expiryDateYear;
        this.CVC = CVC;
        this.cardHoldersName = cardHoldersName;
        this.paymentID=paymentID;
    }

// Denne funktion burde nok være en metode i klassen for at fremvise lidt bedre arbejde med klasser
// Men som forklaret tidligere i koden er det nu en funktion der tilgengæld fungerer virker fint
// Hvis den skal laves til en metode kan man bruge meget lignende logik som funktionen Submit() i customer.js
// Da det essentielt er samme metode og formål denne funktion har. MB
    static validateCreditCard() {
        // Her defineres et par variabler ud fra DOM som der skal køres try/catch på
        var cardNumber=document.getElementById("cardNumber").value;
        var expiryDateMonth=document.getElementById("expiryDateMonth").value;
        var expiryDateYear=document.getElementById("expiryDateYear").value;
        var CVC=document.getElementById("CVC").value;
        var cardHoldersName=document.getElementById("cardHoldersName").value;

        // Der oprettes også en variabel validated som bruges til at kontrollere om der executes et catch block
        // Hvis jeg skriver var foran validated bliver den ikke sat til q i catch block'en
        // Jeg aner ikke hvorfor det ikke virker med var, men nedenstående fungerer altså fint... MB
        var validated = true;
        var errMessage = "";

        // Try/catch for at teste slutbruger input i DOM felt der er defineret som cardnumber
        // Det skal siges at disse try/catch blocks ikke har fået nok opmærksomhed til at det er fejlfrit, langtfra. MB
        try{
            if (cardNumber ==="") throw "Udfyld kortnummer\n";
            if (cardNumber.toString().length !== 16) throw "Kortnummer skal bestå af 16 cifre\n";
            if (isNaN(cardNumber)===true) throw "Kortnummer skal bestå af tal\n";
        }
        catch (error) {
            errMessage += error;
            // alert(error);
            validated = false;
        }

        // Try/catch for DOM-input expiryDateMonth.
        // Jeg har løst mange af problemstillingerne med input i dette felt med funktionen corrrectDates og lidt i html med max værdier.
        try{
            if (expiryDateMonth==="") throw "Udfyld udløbsdato måned\n";
        }
        catch(error){
            errMessage += error;
            validated = false;
        }
        try{
            if (expiryDateYear==="") throw "Udfyld udløbsdato år\n";
        }
        catch(error){
            errMessage += error;
            validated = false;
        }

        // Try/catch for DOM input i CVC
        try{
            if (CVC==="") throw "Udfyld CVC\n";
            if (CVC.toString().length !==3) throw "CVC skal bestå af 3 tal\n";
            if (isNaN(CVC)===true) throw "CVC skal være udelukkende tal\n";
        }
        catch (error) {
            errMessage += error;
            validated = false;
        }

        // Try/catch for cardHoldersName, mangler tjek for:
        // 1. Hvis string indeholder tal (eksl operatorer som f.eks. bindestreg der gerne må være med
        // 2. Hvis man indtaster mellemrum fejler den men får beskeden et navn må ikke være tal, evt. fiks det.
        // Her kan man igen drage inspiration fra customer.js try/catch block for mail. MB
        try {
            if (cardHoldersName==="") throw "Udfyld venligst kortholders navn\n";
            if (isNaN(cardHoldersName)===false) throw "Et navn må ikke være et tal\n";
        }
        catch (error) {
            errMessage += error;
            validated = false;
        }

        // Formål med denne linje er at hvis validated ikke er blevet ændret af en catch block skal vi avancere i codeflow
        // Ved at igangsætte funktionen saveCreditCard(). MB
        if (validated === true){
            //this.saveCreditCard();
            return true;
        } else {
            alert(errMessage);
            return false;
        }
    }

    // Funktionen der tilretter forkerte input i felterne expiryDateMonth og -Year. bliver kaldt ved onblur fra payment.html
    // onblur kører et script når brugeren ikke længere har markeret feltet i html formen.
    // Det var lidt mere overskueligt at lave function til denne da man hurtigt ved hjælp af if statements kunne løse
    // De væsentligste problemer uden at skulle kaste en fejl til slutbrugeren hele tiden men istedet overskrive deres input
    // Forskellen og brugen af if og try/catch kan diskuteres ud fra dette eksempel. MB
    static correctDates() {
        var expiryDateMonth = document.getElementById("expiryDateMonth").value;

        if (expiryDateMonth > 12 || expiryDateMonth < 1) {
            document.getElementById("expiryDateMonth").value = "";
        }
        var expiryDateYear = document.getElementById("expiryDateYear").value;

        if (expiryDateYear > 30 || expiryDateYear < 19) {
            document.getElementById("expiryDateYear").value= "";
        }
    }

    // funktion bliver kaldt af validateCreditCard men ud fra et conditional statement i denne.
    // Formålet med funktionen her er at skubbe input vi har fået fra brugeren i html op i et array for at gemme det
    // Det ville være meget nærliggende at bruge local storage så de ikke ligger i et array. MB
    static saveCreditCard(){
        // Instatierer et nyt objekt ud fra klassens parametre og DOM input. MB
        var newCreditCard = new Payment(document.getElementById("cardNumber").value
            ,document.getElementById("expiryDateMonth").value
            ,document.getElementById("expiryDateYear").value
            ,document.getElementById("CVC").value
            ,document.getElementById("cardHoldersName").value);

        creditCards.push(newCreditCard);
        console.log(JSON.stringify(creditCards));

        var currentOrder = JSON.parse(localStorage.getItem("order"));
        currentOrder.status = "Payment accepted";
        localStorage.setItem('order', JSON.stringify(currentOrder));

        // Kalder en ny funktion der dog sker hver gang saveCreditCard kaldes
        // grunden til opdeling er at det er mere overskueligt at dele op da formålene med funktioner er ret forskellige. MB
       // acceptPayment()
        //proceedFromPayment();
    }
}
/*
function acceptPayment() {
    let currentOrder = JSON.parse(localStorage.getItem("order"));

    for (var i = 0; i < listCustomers.length; i++) {
        if (listCustomers[i].firstName == storeLogIn[0].usernameLoggedin) {
            listCustomers[i].orders.push(currentOrder);
            localStorage.setItem('customerInformationList', JSON.stringify(listCustomers));
            console.log(JSON.parse(localStorage.getItem("customerInformationList")));
        }
    }
}
*/
// Tilføjer eventlistener til submitknap for at sikre at der valideres fra klient-siden inden formen submittes.
const form = document.querySelector('form');
const paymentForm = document.querySelector('#paymentForm');

paymentForm.addEventListener('submit', event=> {
        event.preventDefault();
        console.log("Eventlistener submit");

        if (Payment.validateCreditCard() === false) {
            console.log("fejl");
        } else {
            if (confirm("Bekræft din betaling")){
                form.submit()
            } else {
                console.log("Bruger annulerede sin betaling");
            }
        }
});