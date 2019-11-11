let domoticaGrid = document.getElementById("domotica__grid")
let loginForm = document.getElementById("form__login")
let registerForm = document.getElementById("form__register")


let showDomoticaGrid = () => {
    //render grid
    loginForm.classList.add("remove")
    registerForm.classList.add("remove")
    domoticaGrid.classList.remove("remove")
}

let showLoginForm = () => {
    //render login
    loginForm.classList.remove("remove")
    registerForm.classList.add("remove")
    domoticaGrid.classList.add("remove")
}

let showRegisterForm = () => {
    //render register
    loginForm.classList.add("remove")
    registerForm.classList.remove("remove")
    domoticaGrid.classList.add("remove")

}