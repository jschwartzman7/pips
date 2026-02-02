function displayDisplayDominos(){
    let dominosContainer = document.getElementById("dominosContainer");
    removeChildren(dominosContainer);
    for(let domino of displayDominos){
        dominosContainer.appendChild(domino);
    }
    dominosContainer.appendChild(createAddDomino());
}

function createAddDomino(){
    let addDomino = document.createElement("div");
    addDomino.className = "domino";
    let input1 = document.createElement("input");
    input1.id = "dominoInput1";
    input1.className = "dominoInput";
    input1.addEventListener("change", checkForNewDomino);
    addDomino.appendChild(input1)
    let input2 = document.createElement("input");
    input2.id = "dominoInput2";
    input2.className = "dominoInput";
    input2.addEventListener("change", checkForNewDomino);
    addDomino.appendChild(input2);
    return addDomino;
}

function createDomino(v1, v2){
    let domino = document.createElement("div");
    domino.className = "domino";
    let dominoSquare1 = document.createElement("div");
    dominoSquare1.className = "dominoSquare";
    dominoSquare1.innerHTML = v1;
    domino.appendChild(dominoSquare1)
    let dominoSquare2 = document.createElement("div");
    dominoSquare2.className = "dominoSquare";
    dominoSquare2.innerHTML = v2;
    domino.appendChild(dominoSquare2);
    domino.addEventListener("click", (event) => dominoClick(event, domino));
    return domino;
}

function checkForNewDomino(){
    let input1 = document.getElementById("dominoInput1");
    let input2 = document.getElementById("dominoInput2");
    if(isNaN(input1.value) || isNaN(input2.value) || input1.value === "" || input2.value === ""){
        return
    }
    displayDominos.push(createDomino(input1.value, input2.value));
    displayDisplayDominos();
}

function dominoClick(event, domino){
    if(!event.shiftKey){
        displayDominos.splice(displayDominos.indexOf(domino), 1);
        displayDisplayDominos();
    }
    else{
        let selectedDomino = document.querySelector(".selectedDomino");
        if(selectedDomino === domino){
            domino.className = "domino";
        }
        else{
            if(selectedDomino !== null){
                selectedDomino.className = "domino";
            }
            domino.className = "domino selectedDomino";
        }
    }
}
