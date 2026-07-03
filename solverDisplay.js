function showSolvedBoard(){
    let builtBoard = solver.solveCSP();

    displayBoard = solver.board;
    displayDominos = solver.dominos;
    displayConstraints = solver.constraints;
    for(let dominoIdx = 0; dominoIdx < solver.dominos.length; ++dominoIdx){
        if(dominoIdx in Object.values(builtBoard)){
            let indices = []
            for(let key in builtBoard){
                if(builtBoard[key] === dominoIdx){
                    indices.push(key)
                    if(indices.length === 2){
                        break;
                    }
                }
            }
            displaySolvedDomino(indices);
        }
    }
}

function displaySolvedDomino(boardIndices){
    let i1Tile = document.getElementById(boardIndices[0]);
    i1Tile.innerHTML = solver.board[boardIndices[0]];
    i1Tile.style.alignContent = "center";
    i1Tile.style.textAlign = "center";
    i1Tile.style.fontSize = "30px";
    let i2Tile = document.getElementById(boardIndices[1]);
    i2Tile.innerHTML = solver.board[boardIndices[1]];
    i2Tile.style.alignContent = "center";
    i2Tile.style.textAlign = "center";
    i2Tile.style.fontSize = "30px";
    let i1x = Number(boardIndices[0].split(",")[0]);
    let i2x = Number(boardIndices[1].split(",")[0]);
    let i1y = Number(boardIndices[0].split(",")[1]);
    let i2y = Number(boardIndices[1].split(",")[1]);
    if(i1x - i2x === 0){
         /* upright domino */
        i1Tile.style.borderLeft = "3px solid black";
        i1Tile.style.borderRight = "3px solid black";
        i2Tile.style.borderLeft = "3px solid black";
        i2Tile.style.borderRight = "3px solid black";
        if(i1y > i2y){
            i1Tile.style.borderTop = "3px solid black";
            i2Tile.style.borderBottom = "3px solid black";
        }
        else{
            i1Tile.style.borderBottom = "3px solid black";
            i2Tile.style.borderTop = "3px solid black";
        }
    }
    else{ /* sideways domino */
        i1Tile.style.borderTop = "3px solid black";
        i1Tile.style.borderBottom = "3px solid black";
        i2Tile.style.borderTop = "3px solid black";
        i2Tile.style.borderBottom = "3px solid black";
        if(i1x > i2x){
            i1Tile.style.borderRight = "3px solid black";
            i2Tile.style.borderLeft = "3px solid black";
        }
        else{
            i1Tile.style.borderLeft = "3px solid black";
            i2Tile.style.borderRight = "3px solid black";
        }
    }
}