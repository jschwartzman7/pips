/*
Test:
    getOpenSpaces(board)
    arraySum(arr)
    canSatisfyConstraint(constraint, unusedDominoValues, board)
    isSatisfyingConstraint(constraint, board)

*/

let testOpenSpacesBoards = [{},
                    {"0,0": null},
                    {"0,0": null, "1,0":null},
                    {"0,0": null, "1,0":null, "2,0":null},
                    {"0,0": null, "1,0":null, "2,0":null, "3,0":null},
                    {"0,0": null, "1,0":null, "1,1":null},
                    {"0,0": null, "1,0":null, "1,1":null, "0,1":null},]

let testBoards = [{},
                {"0,0": null},
                {"0,0": 0},
                {"-1,1": null},
                {"-1,1": 1}
            ]

let testConstraints = [
        {type: "<", value: 5, tiles: ["0,0"]},
        {type: "=", value: 5, tiles: ["0,0"]},
        {type: ">", value: 5, tiles: ["0,0"]},
        {type: "==", tiles: ["0,0", "1,0"]},
        {type: "!=", tiles: ["0,0", "1,0"]},
    ]

function testGetOpenSpaces(){
    for(let testOpenSpacesBoard of testOpenSpacesBoards){
        console.log("Testing getOpenSpaces for:");
        console.log(testOpenSpacesBoard);
        console.log("openSpaces:");
        console.log(PipsSolver.getOpenSpaces(testOpenSpacesBoard));
    }
}
