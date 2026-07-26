function removeChildren(htmlObject){
    while(htmlObject.firstChild){
        htmlObject.removeChild(htmlObject.firstChild);
    }
}
new EventManager();

BoardDisplay.displayBoard(PipsState.state);
DominosDisplay.displayDominos(PipsState.state);
ConstraintsDisplay.displayConstraints(PipsState.state);