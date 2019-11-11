// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBL_a6wCy8X6zlz9we80D96gdVtXjpJFeQ",
    authDomain: "wot-domotica.firebaseapp.com",
    databaseURL: "https://wot-domotica.firebaseio.com",
    projectId: "wot-domotica",
    storageBucket: "wot-domotica.appspot.com",
    messagingSenderId: "105783982171",
    appId: "1:105783982171:web:1770ab58754def9eb4677e",
    measurementId: "G-T5KPEXEHPL"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig)



let signIn = async () => {

    let email = document.getElementById("signin_email").value
    let password = document.getElementById("signin_password").value

    await firebase
        .auth()
        .setPersistence(firebase.auth.Auth.Persistence.SESSION)
        .then(() => {
            return firebase.auth().signInWithEmailAndPassword(email, password)
        })
        .then(function (response) {
            console.log("success sign in " + response.user.uid)
            showDomoticaGrid()
        })
        .catch((error) => {
            // Handle Errors here.
            let errorCode = error.code
            let errorMessage = error.message
            console.log(errorCode, errorMessage)
            document.getElementById("signin_error").innerText =
                errorCode + " - " + errorMessage;
        });



}

let isUserLoggedin = () => {
    let currentUser = firebase.auth().currentUser;

    if (currentUser) {
        // User is signed in.
        //redirect dashboard
    } else {
        // No user is signed in.
        // redirect login page
    }
}
let signUp = () => {

    let email = document.getElementById("signup_email").value
    let password = document.getElementById("signup_password").value

    firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(() => {
            showDomoticaGrid()
        })
        .catch((error) => {
            // Handle Errors here.
            let errorCode = error.code
            let errorMessage = error.message

            console.log(errorCode, errorMessage);
            document.getElementById("signup_error").innerHTML =
                errorCode + " - " + errorMessage;
        });
}

function signOut() {
    firebase
        .auth()
        .signOut()
        .then(() => {
            //sendNotification("You are sign out!");
            //document.getElementById("signin_password").value = "";
            showLoginForm()
        }).catch((error) => {
            console.error("Sign Out Error", error)

        })

}

let btnSignin = document.getElementById("btnSignin")
let btnRegister = document.getElementById("btnRegister")
let btnSignup = document.getElementById("btnSignup")
let btnSignout = document.getElementById("btnSignout")

if (btnSignin) {
    btnSignin.addEventListener("click", (e) => {
        e.preventDefault();

        signIn()

    })
}

if (btnRegister) {
    btnRegister.addEventListener("click", (e) => {
        e.preventDefault();

        showRegisterForm()

    })
}

if (btnSignup) {

    btnSignup.addEventListener("click", (e) => {
        e.preventDefault();

        signUp()
    })
}


if (btnSignout) {

    btnSignout.addEventListener("click", (e) => {
        e.preventDefault();

        signOut()
    })
}