class ConstraintsDisplay{

    static displayConstraint(constraintIdx, constraint){
        let constraintContainer = document.createElement("div");
        constraintContainer.className = "constraintContainer";
        let constraintColor = document.createElement("div");
        constraintColor.className = "constraintColor constraint"+constraintIdx+"Tile";
        let constraintText = document.createElement("div");
        constraintContainer.appendChild(constraintColor);
        constraintContainer.appendChild(constraintText);
        let type = ["==", "!="].includes(constraint.type) ? "": constraint.value;
        constraintText.innerHTML = constraint.type + " " + type;
        return constraintContainer;
    }

    static displayConstraints(state){
        if(state.addingConstraintTiles !== null){
            document.getElementById("toggleAddConstraint").classList.add("toggleAddConstraintActive");
        }
        else{
            document.getElementById("toggleAddConstraint").classList.remove("toggleAddConstraintActive");
        }
        let constraintsContainer = document.getElementById("constraintsContainer");
        removeChildren(constraintsContainer);
        for(let constraintIdx in state.constraints){
            constraintsContainer.appendChild(this.displayConstraint(constraintIdx, state.constraints[constraintIdx]));
        }
    }
}

    
