function removeChildren(htmlObject){
    while(htmlObject.firstChild){
        htmlObject.removeChild(htmlObject.firstChild);
    }
}
new EventManager();

PipsState.state.board = easy2.board;
PipsState.state.dominos = easy2.dominos;
PipsState.state.constraints = easy2.constraints;
BoardDisplay.displayBoard(PipsState.state);
DominosDisplay.displayDominos(PipsState.state);
ConstraintsDisplay.displayConstraints(PipsState.state);