class DominosDisplay{
    
    static createAddDomino(){
        let addDomino = document.createElement("div");
        addDomino.className = "domino addNewDomino";
        let input1 = document.createElement("input");
        input1.id = "dominoInput1";
        input1.className = "dominoInput";
        input1.dataset.type = "addDominoPip";
        addDomino.appendChild(input1)
        let input2 = document.createElement("input");
        input2.id = "dominoInput2";
        input2.className = "dominoInput";
        input2.dataset.type = "addDominoPip";
        addDomino.appendChild(input2);
        return addDomino;
    }

    static createDomino(state, dominoIdx){
        let domino = document.createElement("div");
        domino.className = "domino";
        if(dominoIdx === state.selectedDominoIndex){
            domino.classList.add("selectedDomino")
        }
        else if(Object.keys(state.boardDominoMappings).includes(String(dominoIdx))){
            domino.classList.add("boardDomino");
        }
        let dominoSquare1 = document.createElement("div");
        dominoSquare1.className = "dominoSquare";
        dominoSquare1.innerHTML = state.dominos[dominoIdx][0];
        dominoSquare1.dataset.type = "dominoPip";
        domino.appendChild(dominoSquare1)
        let dominoSquare2 = document.createElement("div");
        dominoSquare2.className = "dominoSquare";
        dominoSquare2.innerHTML = state.dominos[dominoIdx][1];
        dominoSquare2.dataset.type = "dominoPip";
        domino.appendChild(dominoSquare2);
        domino.dataset.type = "domino"
        domino.dataset.index = dominoIdx;
        domino.addEventListener("mouseover", () => {EventManager.mouseEnterDomino(domino)});
        domino.addEventListener("mouseleave", () => {EventManager.mouseLeaveDomino(domino)});
        return domino;
    };

    static displayDominos(state){
        let dominosContainer = document.getElementById("dominosContainer");
        removeChildren(dominosContainer);
        for(let dominoIdx in state.dominos){
            dominosContainer.appendChild(this.createDomino(state, Number(dominoIdx)));
        }
        dominosContainer.appendChild(this.createAddDomino());
    }
}