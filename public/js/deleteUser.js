console.log("test");
/*--deleteUser.js--------------------------FETCH DELETE REQUEST-----------------------------------------------------*/
// Bruger fetch til at sende delete-request til endpoint der sletter bruger.


// Gets the element from the button with the class deleteUser in the ejs "account".
const delBtn = document.querySelector('.deleteUser');

function deleteUser () {
    delBtn.addEventListener('click', event => {
        event.preventDefault();
        console.log("Eventlistener submit");

        // Sætter variabel der holder værdien af det givne bruger-id der skal sendes som parameter i requesten.
        let user_id = delBtn.id;
        console.log(user_id);

        // if-else statement der tjekker om kunde bekræfter at denne vil slette sin konto i confirm-metodens dialog-box.
        if (confirm("Er du sikker på at du vil slette din bruger?")){
            // Hvis kunde bekræfter at denne vil slette sin bruger sendes en delete-request vha. fetch

            fetch('/user/delete/'+ user_id, {
                method: 'DELETE'
            })
                .then( json => {
                    // Omdigireres til index-siden da kunden ikke længere er logget ind og ikke har adgang til andre sider.
                    location.href = "http://localhost:3000/";
                })
        } else {
            // Hvis kunde ikke bekræfter dialogboxen
            console.log("Bruger ikke slettet");
        }
    });

};

deleteUser();