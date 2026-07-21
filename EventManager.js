class EventManager{

    static dominosHoverInterval = null;
    static shiftKeyPressed = false;

    constructor(){
        document.body.addEventListener("click", event => EventManager.clickHandler(event));
        document.getElementById("dominosContainer").addEventListener("change", () => EventManager.dominoChangeHandler());
        document.addEventListener("keydown", (event) => {if(event.key === "Shift"){EventManager.shiftKeyPressed = true}});
        document.addEventListener("keyup", (event) => {if(event.key === "Shift"){EventManager.shiftKeyPressed = false}});
    }

    static clickHandler(event){
        switch(event.target.dataset.type){
            case("solvePuzzleButton"):
                PipsState.solvePuzzleClick();
                break;
            case("tile"):
                PipsState.tileClick(event.target.dataset.key);
                break;
            case("dominoPip"):
                let dominoIndex = Number(event.target.parentElement.dataset.index)
                if(this.shiftKeyPressed){
                    PipsState.deleteDominoClick(dominoIndex);
                }
                else{
                    PipsState.toggleDominoClick(dominoIndex);
                }
                break;
            case("addConstraintButton"):
                PipsState.addConstraintClick();
                break;
            case("constraintColor"):
                PipsState.deleteConstraint(event.target.dataset.index);
                break;
            default:
                return;
        }
        BoardDisplay.displayBoard(PipsState.state);
        DominosDisplay.displayDominos(PipsState.state);
        ConstraintsDisplay.displayConstraints(PipsState.state);
    }

    static dominoChangeHandler(){
        let input1 = document.getElementById("dominoInput1").value;
        let input2 = document.getElementById("dominoInput2").value;
        if(PipsState.tryAddDomino(input1, input2)){
            DominosDisplay.displayDominos(PipsState.state);
        }
    }

    static mouseEnterDomino(domino){
        this.dominosHoverInterval = setInterval(() => {
            if(this.shiftKeyPressed){
                domino.classList.add("deletingDomino");
                }
            else{
                domino.classList.remove("deletingDomino");
            }
        }, 100);
    }
    static mouseLeaveDomino(){
        clearInterval(EventManager.dominosHoverInterval);
    }

}
