class CSP{
    constructor(board, dominos, constraints){
        this.board = board
        this.dominos = dominos
        this.constraints = constraints
        this.buildBoard;

        this.backTrackCounter = 0
    }

    /*
    return a mapping of board to indices of dominos subject to constraints, if all dominos can be used
    */
    solveCSP(){
        this.buildBoard = {};
        for(let key of Object.keys(this.board)){
            this.buildBoard[key] = null;
        }
        
        return this.backTrack();
    }

    backTrack(){
        this.backTrackCounter += 1
        if(this.backTrackCounter % 50 === 0){
            console.log(this.backTrackCounter);
        }
        /*
        if a constraint is violated by dominos
            remove most recent tile
            return
        if there are unused dominos
            add a domino to an open space
            backTrack
        return buildBoard
        */
        let numUsedTiles = this.getNumUsedTiles();
        if(numUsedTiles == this.dominos.length){
            return this.buildBoard;
        }
        let newDomino = this.dominos[numUsedTiles];
        for(let openSpace of this.getOpenSpaces()){
            this.board[openSpace[0]] = newDomino[0];
            this.board[openSpace[1]] = newDomino[1];
            this.buildBoard[openSpace[0]] = numUsedTiles;
            this.buildBoard[openSpace[1]] = numUsedTiles;
            if(this.canSatisfyConstraints()){
                let result = this.backTrack();
                if(result !== null){
                    return result;
                }
            }
            
            this.board[openSpace[0]] = newDomino[1];
            this.board[openSpace[1]] = newDomino[0];
            if(this.canSatisfyConstraints()){
                let result = this.backTrack();
                if(result !== null){
                    return result;
                }
            }

            this.board[openSpace[0]] = null;
            this.board[openSpace[1]] = null;
            this.buildBoard[openSpace[0]] = null;
            this.buildBoard[openSpace[1]] = null;
        }
        return null;
    }


    getNumUsedTiles(){
        let usedTiles = new Set();
        for(let val of Object.values(this.buildBoard)){
            if(val !== null){
                usedTiles.add(val);
            }
        }
        return usedTiles.size;
    }

    getOpenSpaces(){
        /* return [[[0,0],[1,0]], [[0,1],[1,1]]] */
        let openSpaces = [];
        for(let space of Object.keys(this.board)){
            let x = Number(space.split(",")[0]);
            let y = Number(space.split(",")[1]);
            if(this.buildBoard[x + "," + y] !== null){
                continue
            }
            if(this.buildBoard[(x+1) + "," + y] === null){
                openSpaces.push([[x + "," + y],[(x+1) + "," + y]]);
            }
            if(this.buildBoard[x + "," + (y+1)] === null){
                openSpaces.push([[x + "," + y],[x + "," + (y+1)]]);
            }
        }
        return openSpaces;
    }


    generateSubsetSums(arr, chosenIndices, k, currentSums, currentIndex){
        /* generate combinations not permutations*/
        if(chosenIndices.length === k){
            let sum = 0;
            for(let idx of chosenIndices){
                sum += arr[idx]
            }
            if(!(currentSums.includes(sum))){
                currentSums.push(sum);
            }
            return;
        }
        if(currentIndex === arr.length){
            return;
        }
        chosenIndices.push(currentIndex);
        this.generateSubsetSums(arr, chosenIndices, k, currentSums, currentIndex+1);
        chosenIndices.pop();
        this.generateSubsetSums(arr, chosenIndices, k, currentSums, currentIndex+1);
    }

    canSatisfyConstraints(){
        /* 
        To estimate for unfilled tiles, maintain of set of subset sums of size numUnfilled to guess if it can be satisfied.
        */
        let subsetSums = {}
        let dominoValues = []
        let numUnfilled = 0;
        for(let constraint of constraints){
            numUnfilled = 0;
            for(let tile of constraint.tiles){
                if(this.board[tile] === null){
                    numUnfilled++;
                }
            }
            if(numUnfilled > 0){
                for(let dominoIdx = 0; dominoIdx < this.dominos.length; ++dominoIdx){
                    if(!(Object.values(this.buildBoard).includes(dominoIdx))){
                        dominoValues.push(this.dominos[dominoIdx][0]);
                        dominoValues.push(this.dominos[dominoIdx][1]);
                    }
                }
                let subsetSumsNumUnfilled = []
                this.generateSubsetSums(dominoValues, [], numUnfilled, subsetSumsNumUnfilled, 0);
                subsetSums[numUnfilled] = subsetSumsNumUnfilled
            }
        }
        for(let constraint of constraints){
            if(!this.isConstraintSatisfied(constraint, subsetSums, dominoValues)){
                return false;
            }
        }
        return true;
    }

    isConstraintSatisfied(constraint, subsetSums, dominoValues){
        let sum = 0;
        let numEmpty = 0
        switch (constraint.type) {
            case "<":
                for(let tile of constraint.tiles){
                    if(this.board[tile] === null){
                        numEmpty++;
                    }
                    else{
                        sum += this.board[tile];
                    }
                }
                if(sum >= constraint.value){
                    return false;
                }
                if(numEmpty === 0){
                    return true;
                }
                if(Math.min(subsetSums[numEmpty]) + sum >= constraint.value){
                    return false;
                }
                return true;
            case "=":
                for(let tile of constraint.tiles){
                    if(this.board[tile] === null){
                        numEmpty++;
                    }
                    else{
                        sum += this.board[tile];
                    }
                }
                if(sum > constraint.value){
                    return false;
                }
                if(numEmpty === 0){
                    if(sum === constraint.value){
                        return true;
                    }
                    return false;
                }
                for(let subsetSum of subsetSums[numEmpty]){
                    if(sum + subsetSum === constraint.value){
                        return true;
                    }
                }
                return false;
            case ">":
                for(let tile of constraint.tiles){
                    if(this.board[tile] === null){
                        numEmpty++;
                    }
                    else{
                        sum += this.board[tile];
                    }
                }
                if(sum > constraint.value){
                    return true;
                }
                if(numEmpty === 0){
                    return false;
                }
                if(Math.max(subsetSums[numEmpty]) + sum <= constraint.value){
                    return false;
                }
                return true;
            case "==":
                let tileValue = null;
                for(let tile of constraint.tiles){
                    if(this.board[tile] === null){
                        numEmpty++;
                    }
                    if(tileValue === null){
                        tileValue = this.board[tile];
                    }
                    else{
                        if(this.board[tile] !== tileValue){
                            return false;
                        }
                    }
                }
                if(numEmpty === 0){
                    return true;
                }
                if(dominoValues.filter(v => v === tileValue).length >= numEmpty){
                    return true;
                }
                return false;
            case "!=":
                let counter = new Set();
                for(let tile of constraint.tiles){
                    if(this.board[tile] === null){
                        numEmpty++;
                    }
                    else{
                        if(counter.has(this.board[tile])){
                            return false;
                        }
                        counter.add(buildBoard[tile])
                    }
                }
                if(numEmpty === 0){
                    return true;
                }
                if(dominoValues.filter(v => v !== tileValue).length >= numEmpty){
                    return true;
                }
                return false;
            default:
                break;
        }
    }
}

/*function checkPlaceDomino(){
    let selectedDomino = document.querySelector(".selectedDomino");
    if(selectedDomino === null || selectedIndices.size !== 2){
        return;
    }
    let dominoV1 = selectedDomino.childNodes[0].innerHTML;
    let dominoV2 = selectedDomino.childNodes[1].innerHTML;
    let selectedIndicesArray = Array.from(selectedIndices);
    let tile1 = document.getElementById(selectedIndicesArray[0]);
    let tile2 = document.getElementById(selectedIndicesArray[1]);
    tile1.innerHTML = dominoV1;
    tile2.innerHTML = dominoV2;
    selectedDomino.className = "domino";
    selectedIndices.clear();
}*/
