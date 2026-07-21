class ConstraintsDisplay{

    static displayConstraint(constraintIdx, constraint){
        let constraintContainer = document.createElement("div");
        constraintContainer.className = "constraintContainer";
        let constraintColor = document.createElement("div");
        constraintColor.className = "constraintColor constraint"+constraintIdx+"Tile";
        constraintColor.dataset.type = "constraintColor";
        constraintColor.dataset.index = constraintIdx;
        let constraintText = document.createElement("div");
        constraintContainer.appendChild(constraintColor);
        constraintContainer.appendChild(constraintText);
        let type = ["==", "!="].includes(constraint.type) ? "": constraint.value;
        constraintText.innerHTML = constraint.type + " " + type;
        return constraintContainer;
    }

    static displayConstraints(state){
        if(state.addingConstraintTiles !== null){
            document.getElementById("addConstraintButton").classList.add("addConstraintButtonActive");
        }
        else{
            document.getElementById("addConstraintButton").classList.remove("addConstraintButtonActive");
        }
        let constraintsContainer = document.getElementById("constraintsContainer");
        removeChildren(constraintsContainer);
        for(let constraintIdx in state.constraints){
            constraintsContainer.appendChild(this.displayConstraint(constraintIdx, state.constraints[constraintIdx]));
        }
    }
}

    
