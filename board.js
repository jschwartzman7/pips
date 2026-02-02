function displayDisplayBoard(){
    let boardContainer = document.getElementById("boardContainer");
    removeChildren(boardContainer);
    let minX = getCurrentBoardOptimum(0, Math.min);
    let maxX = getCurrentBoardOptimum(0, Math.max);
    let minY = getCurrentBoardOptimum(1, Math.min);
    let maxY = getCurrentBoardOptimum(1, Math.max);
    for(let y = maxY+1; y >= minY-1; --y){
        let boardRow = document.createElement("div");
        boardRow.className = "boardRow";
        for(let x = minX-1; x <= maxX+1; ++x){
            boardRow.appendChild(createTile(x, y));
        }
        boardContainer.appendChild(boardRow)
    }
    displayDisplayConstraints();
}

function getCurrentBoardOptimum(index, func){
    if(Object.keys(displayBoard).length === 0){
        return 0;
    }
    return func(...Object.keys(displayBoard).map(entry => Number(entry.split(",")[index])));
}

function createTile(x, y){
    let boardKey = x + "," + y;
    let newTile = document.createElement("div");
    newTile.addEventListener("click", (event) => tileClick(event, boardKey, newTile));
    if(boardKey in displayBoard){
        newTile.id = boardKey;
        newTile.className = "tile existingTile";
        if(addingConstraintTiles.has(boardKey)){
            newTile.className = newTile.className + " addingConstraintTile";
        }
        /*if(selectedIndices.has(boardKey)){
            newTile.className = "tile existingTile selectedTile";
        }
        else{
            newTile.className = "tile existingTile";
        }*/
        /*newTile.addEventListener("click", (event) => existingTileClick(event, boardKey, newTile));*/
        return newTile;
    }
    else{
        newTile.className = "tile nonexistingTile";
        return newTile;
    }
}

function tileClick(event, boardKey, tile){
    if(boardKey in displayBoard){
        if(addingConstraints){
            if(addingConstraintTiles.has(boardKey)){
                tile.className = "tile existingTile";
                addingConstraintTiles.delete(boardKey);
            }
            else{
                tile.className = "tile existingTile addingConstraintTile";
                addingConstraintTiles.add(boardKey);
            }
        }
        else{
            delete displayBoard[boardKey];
            /*selectedIndices.delete(boardKey);*/
            tile.className = "tile nonexistingTile";
        }
    }
    else{
        displayBoard[boardKey] = null;
        tile.className = "tile existingTile";
    }
    displayDisplayBoard();
}

function existingTileClick(event, boardKey, newTile){
    if (!event.shiftKey){
        return;
    }
    if(selectedIndices.has(boardKey)){
        newTile.className = "tile existingTile";
        selectedIndices.delete(boardKey);
    }
    else{
        newTile.className = "tile existingTile selectedTile";
        selectedIndices.add(boardKey);
    }
    /*checkPlaceDomino()*/; 
}

