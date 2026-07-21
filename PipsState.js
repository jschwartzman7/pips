class PipsState{

    static state = {board: [], /* ["0,0", "1,0", ...] existing tileKeys */
                    dominos: [], /* [["1, 2"], ["5, 5"], ...] domino values*/
                    constraints: [], /* [{type:__, value:__, tiles:__}, ...] constraints*/
                    boardDominoMappings: {}, /* {0: ["0,1", "1,1"], ...} dominoIndex -> 2 adjacent tiles */
                    selectedDominoIndex: -1, /* {0,.. dominos.length-1} */
                    pushingDominoTile1: null, /* "2,3" tileKey */
                    pushingDominoTile2: null, /* "4,0" tileKey */
                    pushingDominoTileIndex: 0, /* {0, 1} */
                    addingConstraintTiles: null, /* ["0,0", "1,0", ...] existing tileKeys */
                    };

    static isWholeNumber(x){
        let reg = /^(0|[1-9]\d*)$/;
        return reg.test(x);
    }

    static tileClick(tileKey){
        if(!this.state.board.includes(tileKey)){/*nonexisting tile*/
            this.state.board.push(tileKey);
            return;
        }
        if(this.state.selectedDominoIndex !== -1){/*domino selected*/
            if(Object.values(this.state.boardDominoMappings).flat().includes(tileKey)){/*board domino clicked*/
                return;
            }
            if(this.state.pushingDominoTileIndex === 0){
                this.state.pushingDominoTile1 = tileKey;
                if(this.state.pushingDominoTile2 === this.state.pushingDominoTile1){
                    this.state.pushingDominoTile2 = null;
                }
                this.state.pushingDominoTileIndex = 1;
            }
            else{
                this.state.pushingDominoTile2 = tileKey;
                if(this.state.pushingDominoTile2 === this.state.pushingDominoTile1){
                    this.state.pushingDominoTile1 = null;
                }
                this.state.pushingDominoTileIndex = 0;
            }
        }
        else if(this.state.addingConstraintTiles !== null){/*adding constraints*/
            if(this.state.addingConstraintTiles.includes(tileKey)){
                this.state.addingConstraintTiles.splice(this.state.addingConstraintTiles.indexOf(tileKey), 1);
            }
            else{
                this.state.addingConstraintTiles.push(tileKey);
            }
        }
        else{/*empty tile*/
            for(let dominoKey in this.state.boardDominoMappings){/* remove overlapping domino */
                if(this.state.boardDominoMappings[dominoKey][0] === tileKey || this.state.boardDominoMappings[dominoKey][1] === tileKey){
                    delete this.state.boardDominoMappings[dominoKey];
                    return;
                }
            }
            let constrainedTile = false;
            if(this.removeTilesFromConstraints([tileKey])){/* remove overlapping constraint */
                constrainedTile = true;
            };
            if(!constrainedTile){
                this.state.board.splice(this.state.board.indexOf(tileKey), 1);
            }
            
        }
    }

    static updateBoardDominoMappings(deletedDominoIndex){
        for(let dominoIndex in this.state.boardDominoMappings){
            if(Number(dominoIndex) > deletedDominoIndex){
                this.state.boardDominoMappings[Number(dominoIndex)-1] = this.state.boardDominoMappings[dominoIndex];
                delete this.state.boardDominoMappings[dominoIndex];
            }
        }
    }

    static deleteDominoClick(dominoIndex){
        this.state.dominos.splice(dominoIndex, 1);
        delete this.state.boardDominoMappings[dominoIndex];
        this.updateBoardDominoMappings(dominoIndex)
        if(this.state.selectedDominoIndex !== -1){/*selected domino exists*/
            if(dominoIndex === this.state.selectedDominoIndex){/*selected domino clicked*/
                this.resetAddDomino();
            }
            else if(dominoIndex < this.state.selectedDominoIndex){/*selected domino above clicked*/
                this.state.selectedDominoIndex--;
            }
        }
    }
    static toggleDominoClick(dominoIndex){
        if(this.state.selectedDominoIndex === dominoIndex){/*domino selected*/
            this.tryAddDominoToBoard();
            this.resetAddDomino();
        }
        else{/*not clicked on selected domino*/
            this.state.selectedDominoIndex = dominoIndex;
            this.state.pushingDominoTileIndex = 0;
            this.tryAddConstraint();
        }
    }

    static addConstraintClick(){
        if(this.state.addingConstraintTiles === null){/*not currently adding constraints*/
            this.state.addingConstraintTiles = [];
            this.tryAddDominoToBoard();
            this.resetAddDomino();
        }
        else{/*currently adding constraints*/
            this.tryAddConstraint();
        }
    }

    static resetAddDomino(){
        this.state.selectedDominoIndex = -1;
        this.state.pushingDominoTile1 = null;
        this.state.pushingDominoTile2 = null;
    }

    static tryAddDominoToBoard(){
        if(this.state.selectedDominoIndex === -1 || this.state.pushingDominoTile1 === null || this.state.pushingDominoTile2 === null){
            return false;
        }
        let v1x = Number(this.state.pushingDominoTile1.split(",")[0])
        let v1y = Number(this.state.pushingDominoTile1.split(",")[1])
        let v2x = Number(this.state.pushingDominoTile2.split(",")[0])
        let v2y = Number(this.state.pushingDominoTile2.split(",")[1])
        if((v1x===v2x && Math.abs(v1y-v2y)===1) || (v1y===v2y && Math.abs(v1x-v2x)===1)){
            this.state.boardDominoMappings[this.state.selectedDominoIndex] = [this.state.pushingDominoTile1, this.state.pushingDominoTile2];
        }
    }

    static tryAddDomino(v1, v2){
        if(this.isWholeNumber(v1) && this.isWholeNumber(v2)){
            this.state.dominos.push([v1, v2]);
            return true;
        }
        return false;
    }

    static resetAddConstraint(){
        this.state.addingConstraintTiles = null;
        document.getElementById("newConstraintType").value = "";
        document.getElementById("newConstraintValue").value = "";
    }

    static deleteConstraint(constraintIndex){
        this.state.constraints.splice(constraintIndex, 1);
    }

    static removeTilesFromConstraints(tilesToRemove){
        /* Removes tilesToRemove from any overlapping constraints, deleting the constraint if no remaining tiles exist */
        let constraintsToRemove = [];
        let modifiedState = false;
        for(let constraint of this.state.constraints){
            for(let tileToRemove of tilesToRemove){
                if(constraint.tiles.includes(tileToRemove)){
                    constraint.tiles.splice(constraint.tiles.indexOf(tileToRemove), 1);
                    modifiedState = true;
                }
            }
            if(constraint.tiles.length === 0){
                constraintsToRemove.push(constraint)
            }
        }
        for(let constraintToRemove of constraintsToRemove){
            this.state.constraints.splice(this.state.constraints.indexOf(constraintToRemove), 1)
        }
        return modifiedState;
    }

    static tryAddConstraint(){
        if(this.state.addingConstraintTiles == null){return};
        let constraintType = document.getElementById("newConstraintType").value;
        let constraintValue = document.getElementById("newConstraintValue").value;
        if(this.state.addingConstraintTiles.length > 0 && ["<", "=", ">", "==", "!="].includes(constraintType) && (["==", "!="].includes(constraintType) || this.isWholeNumber(constraintValue))){
            this.removeTilesFromConstraints(this.state.addingConstraintTiles);
            this.state.constraints.push({type: constraintType,
                                        value: constraintValue,
                                        tiles: this.state.addingConstraintTiles});
        }
        this.resetAddConstraint()
    }

    static solvePuzzleClick(){
        let solverBoard = Object.fromEntries(this.state.board.map(tileKey => [tileKey, null]));
        let result = PipsSolver.solveCSP(solverBoard, this.state.dominos, this.state.constraints);
        if(result === null){
            alert("No Solution");
        }
        else{
            this.state.boardDominoMappings = result;
            this.resetAddDomino();
            this.resetAddConstraint();
        }
    }

}