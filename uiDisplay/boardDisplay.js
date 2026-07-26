class BoardDisplay{

    static getDominoTileDirection(tileKey, otherTileKey){
        let tileX = Number(tileKey.split(",")[0]);
        let tileY = Number(tileKey.split(",")[1]);
        let otherTileX = Number(otherTileKey.split(",")[0]);
        let otherTileY = Number(otherTileKey.split(",")[1]);
        if(tileX < otherTileX){
            return "leftDominoTile";
        }
        else if(tileX > otherTileX){
            return "rightDominoTile";
        }
        else if(tileY < otherTileY){
            return "bottomDominoTile";
        }
        else{
            return "topDominoTile";
        }
    }

    static getTile(state, tileKey){
        let tile = document.createElement("div");
        tile.dataset.type = "tile";
        tile.dataset.key = tileKey;
        tile.className = "tile";
        if(!state.board.includes(tileKey)){/*nonexisting tile*/
            tile.classList.add("nonexistingTile");
            return tile;
        }
        tile.classList.add("existingTile");
        for(let dominoKey in state.boardDominoMappings){
            if(state.boardDominoMappings[dominoKey][0] === tileKey){/*domino pip 1 placed on tile*/
                tile.classList.add(this.getDominoTileDirection(tileKey, state.boardDominoMappings[dominoKey][1]));
                tile.innerHTML = state.dominos[dominoKey][0];
                break;
            }
            else if(state.boardDominoMappings[dominoKey][1] === tileKey){/*domino pip 2 placed on tile*/
                tile.classList.add(this.getDominoTileDirection(tileKey, state.boardDominoMappings[dominoKey][0]));
                tile.innerHTML = state.dominos[dominoKey][1];
                break;
            }
        }
        for(let constraintIdx in state.constraints){
            if(state.constraints[constraintIdx].tiles.includes(tileKey)){/*constrained tile*/
                tile.classList.add("constraint"+constraintIdx+"Tile");
                break;
            }
        }
        if(state.addingConstraintTiles !== null && state.addingConstraintTiles.includes(tileKey)){/*new constraint selected*/
            tile.classList.add("addingConstraintTile");
        }
        else if(state.pushingDominoTile1 === tileKey){/*pushing value 1*/
                tile.classList.add("pushingDominoValueTile1")
        }
        else if(state.pushingDominoTile2 === tileKey){/*pushing value 2*/
                tile.classList.add("pushingDominoValueTile2")
        }
        return tile;
    }

    static #getBoardOptimum(board, xOrY, func){
        if(board.length === 0){
            return 0;
        }
        return func(...board.map(entry => Number(entry.split(",")[xOrY])));
    }

    static displayBoard(state){
        let boardContainer = document.getElementById("boardContainer");
        removeChildren(boardContainer);
        let minX = this.#getBoardOptimum(state.board, 0, Math.min);
        let maxX = this.#getBoardOptimum(state.board, 0, Math.max);
        let minY = this.#getBoardOptimum(state.board, 1, Math.min);
        let maxY = this.#getBoardOptimum(state.board, 1, Math.max);
        for(let y = maxY+1; y >= minY-1; --y){
            let boardRow = document.createElement("div");
            boardRow.className = "boardRow";
            for(let x = minX-1; x <= maxX+1; ++x){
                boardRow.appendChild(this.getTile(state, x + "," + y));
            }
            boardContainer.appendChild(boardRow);
        }
    }
}

