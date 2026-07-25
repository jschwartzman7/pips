class PipsSolver{

    static boardDominoMappings = {}
    static backTrackCounter = 0

    /*
    return boardDominoMappings if all dominos can be used, else return null
    */
    static solveCSP(board, dominos, constraints){
        this.boardDominoMappings = {};
        return this.backTrack(board, dominos, constraints);
    }

    static backTrack(board, dominos, constraints){
        this.backTrackCounter += 1
        if(this.backTrackCounter % 50 === 0){
            console.log(this.backTrackCounter);
        }
        let numUsedDominos = this.getNumUsedDominos();
        if(numUsedDominos == dominos.length){
            if(this.isSatisfyingConstraints(board, dominos, constraints)){
                return this.boardDominoMappings;
            }
            return null
        }
        let newDomino = dominos[numUsedDominos];
        for(let openSpace of this.getOpenSpaces(board)){
            this.boardDominoMappings[numUsedDominos] = [openSpace[0], openSpace[1]]
            board[openSpace[0]] = Number(newDomino[0]);
            board[openSpace[1]] = Number(newDomino[1]);
            if(this.canSatisfyConstraints(board, dominos, constraints)){
                let result = this.backTrack(board, dominos, constraints);
                if(result !== null){
                    return result;
                }
            }
            this.boardDominoMappings[numUsedDominos] = [openSpace[1], openSpace[0]]
            board[openSpace[0]] = Number(newDomino[1]);
            board[openSpace[1]] = Number(newDomino[0]);
            if(this.canSatisfyConstraints(board, dominos, constraints)){
                let result = this.backTrack(board, dominos, constraints);
                if(result !== null){
                    return result;
                }
            }
            delete this.boardDominoMappings[numUsedDominos]
            board[openSpace[0]] = null;
            board[openSpace[1]] = null;
        }
        return null;
    }

    static getNumUsedDominos(){
        return Object.keys(this.boardDominoMappings).length;
    }

    static getOpenSpaces(board){
        /* return [["0,0", "1,0"], ["0,1", "1,1"]] */
        let openSpaces = [];
        for(let space of Object.keys(board)){
            if(Object.values(this.boardDominoMappings).flat().includes(space)){
                continue;
            }
            let x = Number(space.split(",")[0]);
            let y = Number(space.split(",")[1]);
            if(!Object.values(this.boardDominoMappings).flat().includes((x+1) + "," + y) && Object.keys(board).includes((x+1) + "," + y)){
                openSpaces.push([(x + "," + y), ((x+1) + "," + y)]);
            }
            if(!Object.values(this.boardDominoMappings).flat().includes(x + "," + (y+1)) && Object.keys(board).includes(x + "," + (y+1))){
                openSpaces.push([(x + "," + y), (x + "," + (y+1))]);
            }
        }
        return openSpaces;
    }


    /*static generateSubsetSums(arr, chosenIndices, k, currentSums, currentIndex){
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
    }*/

    static arraySum(arr){
        return arr.reduce((accumulator, currentValue) => accumulator + currentValue);
    }

    static canSatisfyConstraints(board, dominos, constraints){
        /* 
        To estimate for unfilled tiles, maintain of set of subset sums of size numUnfilled to guess if it can be satisfied.
        */
        let unusedDominoValues = []
        for(let dominoIdx in dominos){
            if(!(Object.keys(this.boardDominoMappings).includes(dominoIdx))){
                unusedDominoValues.push(Number(dominos[dominoIdx][0]));
                unusedDominoValues.push(Number(dominos[dominoIdx][1]));
            }
        }
        for(let constraint of constraints){
            if(!this.canSatisfyConstraint(constraint, unusedDominoValues.toSorted(), board)){
                return false;
            }
        }
        return true;
    }

    static canSatisfyConstraint(constraint, unusedDominoValues, board){
        /* Cannot return false negatives; Cannot return false when constraint can be satisfied */
        /* Can return false positives; Can return true when constraint cannot be satisfied */
        let sum = 0;
        let numEmpty = 0
        switch (constraint.type) {
            case "<":
                for(let tile of constraint.tiles){
                    if(board[tile] === null){
                        numEmpty++;
                    }
                    else{
                        sum += board[tile];
                    }
                }
                if(sum >= Number(constraint.value)){
                    return false;
                }
                if(numEmpty > 0){
                    if(this.arraySum(unusedDominoValues.slice(0, numEmpty)) + sum >= Number(constraint.value)){
                        return false;
                    }
                }
                return true;
            case "=":
                for(let tile of constraint.tiles){
                    if(board[tile] === null){
                        numEmpty++;
                    }
                    else{
                        sum += board[tile];
                    }
                }
                if(sum > Number(constraint.value)){
                    return false;
                }
                return true;
            case ">":
                for(let tile of constraint.tiles){
                    if(board[tile] === null){
                        numEmpty++;
                    }
                    else{
                        sum += board[tile];
                    }
                }
                if(numEmpty > 0){
                    if(this.arraySum(unusedDominoValues.slice(-numEmpty)) + sum <= Number(constraint.value)){
                        return false;
                    }
                }
                else if(sum <= Number(constraint.value)){
                    return false;
                }
                return true;
            case "==":
                let tileValue = board[constraint.tiles[0]];
                for(let tile of constraint.tiles){
                    if(board[tile] === null){
                        numEmpty++;
                    }
                    else if(board[tile] !== tileValue){
                        return false;
                    }
                }
                if(numEmpty > 0){
                    if(unusedDominoValues.filter(v => v === tileValue).length < numEmpty){
                        return false;
                    }
                }
                return true;
            case "!=":
                let uniqueTiles = new Set();
                for(let tile of constraint.tiles){
                    if(board[tile] === null){
                        numEmpty++;
                    }
                    else{
                        if(uniqueTiles.has(this.board[tile])){
                            return false;
                        }
                        uniqueTiles.add(this.board[tile]);
                    }
                }
                return true;
            default:
                break;
        }
    }

    static isSatisfyingConstraints(board, dominos, constraints){
        for(let constraint of constraints){
            if(!this.isSatisfyingConstraint(constraint, board)){
                return false;
            }
        }
        return true;
    }

    static isSatisfyingConstraint(constraint, board){
        let sum = 0;
        switch (constraint.type) {
            case "<":
                for(let tile of constraint.tiles){
                    if(board[tile] !== null){
                        sum += board[tile];
                    }
                }
                if(sum >= Number(constraint.value)){
                    return false;
                }
                return true;
            case "=":
                for(let tile of constraint.tiles){
                    if(board[tile] !== null){
                        sum += board[tile];
                    }
                }
                if(sum !== Number(constraint.value)){
                    return false;
                }
                return true;
            case ">":
                for(let tile of constraint.tiles){
                    if(board[tile] !== null){
                        sum += board[tile];
                    }
                }
                if(sum <= Number(constraint.value)){
                    return false;
                }
                return true;
            case "==":
                let tileValue = board[constraint.tiles[0]];
                for(let tile of constraint.tiles){
                    if(board[tile] !== tileValue){
                        return false;
                    }
                }
                return true;
            case "!=":
                let uniqueTiles = new Set();
                for(let tile of constraint.tiles){
                    if(uniqueTiles.has(this.board[tile])){
                        return false;
                    }
                    uniqueTiles.add(this.board[tile]);
                }
                return true;
            default:
                break;
        }
    }

}
