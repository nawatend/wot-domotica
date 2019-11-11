let database = firebase.database()


//check if user logged in
firebase.auth().onAuthStateChanged(user => {
    if (user) {
        showDomoticaGrid()

    } else {
        showLoginForm()

    }
})

//end fake routes
let content = document.getElementById("content")


let generateGrid = () => {

    let gridContainer = document.getElementById('gridContainer')

    if (gridContainer) {
        for (let i = 0; i < 64; i++) {
            let div = document.createElement('div');
            div.classList.add('grid__box')
            gridContainer.appendChild(div)
        }
    }
}


let generateId = () => {
    return '-' + Math.random().toString(32).substr(2, 5);
}

let addNewCharacter = (charArrColors) => {

    let customName = `custom${generateId()}`
    let ref = database.ref("characters/saved/" + customName).set(JSON.stringify(charArrColors))

}


let genRandomColor = () => {

    return Math.floor(Math.random() * 256);
}

let generateRandomCharacter = () => {

    let x = [0, 0, 0]
    let randomColor = [genRandomColor(), genRandomColor(), genRandomColor()]

    let newChar = [
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
    ]


    for (let i = 0; i < 8; i++) {

        for (let j = 0; j < 4; j++) {

            let randomIsLightOn = Math.floor(Math.random() * 2)

            if (randomIsLightOn === 0) {
                newChar[i * 8 + j] = x
                newChar[i * 8 + Math.abs(j - 7)] = x

            } else {
                newChar[i * 8 + j] = randomColor
                newChar[i * 8 + Math.abs(j - 7)] = randomColor
            }
        }
    }


    console.log(JSON.stringify(newChar))

    return newChar


}


//addNewCharacter(generateRandomCharacter())


let clearGrid = () => {
    Array.from(boxes).forEach(box => {
        box.classList.remove('grid__selected')
    });
}


//execute all functions here

//created a 8x8 grid in gridContainer
generateGrid()

//handle click on boxes
let boxes = Array.from(document.getElementsByClassName('grid__box'))
let btnClear = document.getElementById('actionClear')
let btnTurnOnAll = document.getElementById("actionOn")
let btnTurnOffAll = document.getElementById("actionOff")
let btnAlarm = document.getElementById("actionAlarm")
let btnStopAlarm = document.getElementById("actionStopAlarm")

if (btnClear) {
    btnClear.addEventListener("click", () => {
        Array.from(boxes).forEach(box => {
            box.classList.remove('grid__selected')
        });
    })
}

//specifying grid for devices
let lights = [2, 5, 34, 37]
let outlets = [24, 31, 59, 60]
let frontdoor = [40, 48, 56]
let backdoor = [47, 55, 63]


//lights
lights.forEach(light => { //
    boxes[light].classList.add("light-off")
    boxes[light].addEventListener("click", () => {
        boxes[light].classList.toggle("light-on")
        // light.classList.add("yellow-dark")
    })
});

//outlets
outlets.forEach(outlet => {
    boxes[outlet].classList.add("outlet-off")
    boxes[outlet].addEventListener("click", () => {
        boxes[outlet].classList.toggle("outlet-on")
    })
});

//doors
//front door

frontdoor.forEach(frontdoorBox => {
    boxes[frontdoorBox].classList.add("door-off")
    boxes[frontdoorBox].addEventListener("click", () => {
        frontdoor.forEach(frontdoorBox => {
            boxes[frontdoorBox].classList.toggle("door-on")
        });
    })
});

//back door

backdoor.forEach(backdoorBox => {
    boxes[backdoorBox].classList.add("door-off")
    boxes[backdoorBox].addEventListener("click", () => {
        backdoor.forEach(backdoorBox => {
            boxes[backdoorBox].classList.toggle("door-on")
        });
    })
})

//get setting from firebase and set on frontend UI
let getSettingFromFB = () => {

    let homeSetting = database.ref("/homeSetting")
    homeSetting.on("value", (snapshot) => {
        let settings = JSON.parse(snapshot.val())

        settings.forEach((setting, id) => {
            //lights
            lights.forEach((lightId) => {

                if (lightId === id) {
                    if (setting[0] === 255) {
                        boxes[lightId].classList.add("light-on")
                        //console.log(" light on " + id)
                    } else {
                        boxes[lightId].classList.remove("light-on")
                    }
                }
            });

            //outlets
            outlets.forEach((outletId) => {
                if (outletId === id) {
                    if (setting[0] === 141) {
                        boxes[outletId].classList.add("outlet-on")
                        //console.log(" outlet on " + id)
                    }
                }
            });


            //frontdoor
            frontdoor.forEach((frontdoorId) => {
                if (frontdoorId === id) {
                    if (setting[1] === 254) {
                        boxes[frontdoorId].classList.add("door-on")
                        //console.log("Front door on " + id)
                    } else {
                        boxes[frontdoorId].classList.remove("door-on")
                    }
                }
            });

            //backdoor
            backdoor.forEach((backdoorId) => {
                if (backdoorId === id) {
                    if (setting[1] === 254) {
                        boxes[backdoorId].classList.add("door-on")
                        //console.log("Back door on " + id)
                    } else {
                        boxes[backdoorId].classList.remove("door-on")
                    }
                }
            });
        });
    })
    //console.log("got setting")
}
getSettingFromFB()

if (btnTurnOnAll) {

    btnTurnOnAll.addEventListener("click", () => {
        boxes.forEach(box => {
            (box.classList.contains("door-off")) ? box.classList.add("door-on"): console.log("next");
            (box.classList.contains("light-off")) ? box.classList.add("light-on"): console.log("next");
            (box.classList.contains("outlet-off")) ? box.classList.add("outlet-on"): console.log("next");
        });
        updateDomotica()
    })
}

if (btnTurnOffAll) {

    btnTurnOffAll.addEventListener("click", () => {
        boxes.forEach(box => {
            (box.classList.contains("door-on")) ? box.classList.remove("door-on"): (box.classList.contains("light-on")) ? box.classList.remove("light-on") :
                (box.classList.contains("outlet-on")) ? box.classList.remove("outlet-on") :
                '';
        });
        updateDomotica()
    })
}



if (btnAlarm) {
    btnAlarm.addEventListener("click", () => {
        database.ref("alarm").set(true)

        btnAlarm.classList.toggle("remove")
        btnStopAlarm.classList.toggle("remove")
    })
}

let alarm = database.ref("/alarm")
alarm.on("value", (snapshot) => {
    if (snapshot.val()) {
        let idInterval = setInterval(() => {
            boxes.forEach(box => {
                (box.classList.contains("door-off")) ? box.classList.add("door-on"): (box.classList.contains("light-off")) ? box.classList.toggle("light-on") :
                    '';
            });
        }, 300);
        localStorage.setItem("idInterval", idInterval)
    }
})


if (btnStopAlarm) {
    btnStopAlarm.addEventListener("click", () => {
        database.ref("alarm").set(false)
        let idInterval = localStorage.getItem("idInterval")
        clearInterval(idInterval)

        getSettingFromFB()
        btnAlarm.classList.toggle("remove")
        btnStopAlarm.classList.toggle("remove")
    })
}


let doesElemHasClass = (element, className) => {
    return element.classList.contains(className)
}

//get setting from changes
let getChangesData = () => {

    //non devices
    let x = [0, 0, 0]
    let grid = [
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
        x, x, x, x, x, x, x, x,
    ];


    //for lights -  [boxes[2], boxes[5], boxes[34], boxes[37]]
    lights.forEach(light => {
        (doesElemHasClass(boxes[light], "light-on")) ? grid[light] = lightOn: grid[light] = lightOff;
    });

    //for outlets - [boxes[24], boxes[31], boxes[59], boxes[60]]
    outlets.forEach(outlet => {
        (doesElemHasClass(boxes[outlet], "outlet-on")) ? grid[outlet] = outletOn: grid[outlet] = outletOff;
    });

    //frontdoor - [40, 48, 56]
    frontdoor.forEach(frontdoorBox => {
        (doesElemHasClass(boxes[frontdoorBox], "door-on")) ? grid[frontdoorBox] = doorOn: grid[frontdoorBox] = doorOff;
    });

    //backdoor - [47, 55, 63]
    backdoor.forEach(backdoorBox => {
        (doesElemHasClass(boxes[backdoorBox], "door-on")) ? grid[backdoorBox] = doorOn: grid[backdoorBox] = doorOff;
    });

    //console.log(grid)

    database.ref("homeSetting").set(JSON.stringify(grid))
}

//update temp and humidity
let environment = database.ref("environment")

environment.on("value", (snapshot) => {

    let temp = document.getElementById("temperature")
    let humi = document.getElementById("humidity")
    temp.innerText = snapshot.val()['temperature'].value + ' ' + snapshot.val()['temperature'].unit
    humi.innerText = snapshot.val()['humidity'].value + ' ' + snapshot.val()['humidity'].unit
})
//update database
let updateDomotica = () => {
    getChangesData()
}

boxes.forEach(box => {
    box.addEventListener("click", () => {
        updateDomotica()
    })
});