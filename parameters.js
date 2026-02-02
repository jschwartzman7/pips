let displayBoard = {};
let displayDominos = [];
let displayConstraints = [];
let addingConstraints = false;
let addingConstraintTiles = new Set();
let constraintNumber = 1;

/*let selectedIndices = new Set();*/

let solver = new CSP(testBoard, testDominos, testConstraints);