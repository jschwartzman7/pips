class EventManager{

    static dominosHoverInterval = null;
    static shiftKeyPressed = false;

    constructor(){
        document.body.addEventListener("click", event => EventManager.clickHandler(event));
        document.getElementById("dominosContainer").addEventListener("change", event => EventManager.dominoChangeHandler());
        document.addEventListener('keydown', (event) => {if(event.key === "Shift"){EventManager.shiftKeyPressed = true;}});
        document.addEventListener('keyup', (event) => {if(event.key === "Shift"){EventManager.shiftKeyPressed = false;}});
    }

    static clickHandler(event){
        switch(event.target.dataset.type){
            case("tile"):
                PipsState.tileClick(event.target.dataset.key);
                break;
            case("dominoPip"):
                if(this.shiftKeyPressed){
                    PipsState.deleteDominoClick(event.target.parentElement.dataset.index);
                }
                else{
                    PipsState.toggleDominoClick(event.target.parentElement.dataset.index);
                }
                break;
            case("addConstraintButton"):
                PipsState.addConstraintClick();
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
        if(isNaN(input1) || isNaN(input2) || input1 === "" || input2 === "" || input1%1 !== 0 || input2%1 !== 0){
            return false
        }
        PipsState.addDomino(input1, input2);
        DominosDisplay.displayDominos(PipsState.state);
    }
}
