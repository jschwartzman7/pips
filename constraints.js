document.getElementById("toggleAddConstraint").addEventListener("click", function(){
    addingConstraints = addingConstraints ? false : true;
    if(addingConstraints){
        document.getElementById("toggleAddConstraint").className = "toggleAddConstraintActive";
    }
    else{
        document.getElementById("toggleAddConstraint").className = "";
        let constraintType = document.getElementById("newConstraintType").value;
        let constraintValue = document.getElementById("newConstraintValue").value;
        let constraintTiles = [];
        for(let constraintTile of addingConstraintTiles){
            document.getElementById(constraintTile).className = "tile existingTile";
            constraintTiles.push(constraintTile);
        }
        let newConstraint = {type: constraintType,
                            value: constraintValue,
                            tiles: constraintTiles}
        if(constraintType !== "" && constraintValue !== "" && addingConstraintTiles.size !== 0){
            displayConstraints.push(newConstraint);
            addConstraintToBoard(newConstraint);
        }
        addingConstraintTiles.clear();
        document.getElementById("newConstraintType").value = "";
        document.getElementById("newConstraintValue").value = "";
    }
});

function addConstraintToBoard(constraint){
    console.log(displayConstraints);
    

    let constraintNumber = displayConstraints.indexOf(constraint)+1;
    let marker = document.createElement("div");
    marker.innerHTML = constraint.type + "" + constraint.value;
    marker.className = "constraintMarker + constraintMarker"+constraintNumber;

    let markerTileIndex = constraint.tiles[0];
    for(let index in constraint.tiles){
        document.getElementById(constraint.tiles[index]).className = document.getElementById(constraint.tiles[index]).className + " constraint"+constraintNumber+"Tile";
        if(Number(constraint.tiles[index][0]) > Number(markerTileIndex[0]) || (Number(constraint.tiles[index][0]) === Number(markerTileIndex[0]) && Number(constraint.tiles[index][2]) < Number(markerTileIndex[2]))){
            markerTileIndex = constraint.tiles[index];
        }
    }
    let markedTile = document.getElementById(constraint.tiles[0]);
    markedTile.appendChild(marker);
}

function displayDisplayConstraints(){
    for(let constraint of displayConstraints){
        addConstraintToBoard(constraint);
    }
}