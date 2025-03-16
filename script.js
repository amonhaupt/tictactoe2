let squares = document.querySelectorAll(".square");
let squareContainers = document.querySelectorAll(".square-container");
let activePlayer = 0;

const winPatterns = [
    [0, 1, 2],
    [0, 3, 6],
    [0, 4, 8],
    [1, 4, 7],
    [2, 5, 8],
    [2, 4, 6],
    [3, 4, 5],
    [6, 7, 8]
];
let winStates = ["","","","","","","","",""];
let gameEnded = false;

squares.forEach((square, index) => {
    square.addEventListener('click', function(event) {
        const button = event.target;
        const parentElement = event.target.parentElement;
        const grandParentElement = event.target.parentElement.parentElement;
        const buttonRelativeIndex = (index - (9 * Array.from(event.target.parentElement.parentElement.children).indexOf(event.target.parentElement)));
        const alsoButtonRelativeIndex = (Array.from(event.target.parentElement.children).indexOf(event.target));
        const parentIndex = Array.from(event.target.parentElement.parentElement.children).indexOf(event.target.parentElement);

        handleClick(button, buttonRelativeIndex, parentElement, parentIndex, grandParentElement);
    });
});

function handleClick(button, buttonRelativeIndex, parentElement, parentIndex, grandParentElement) {
    
    if (activePlayer == 0) {

        button.textContent = "O";
        activePlayer += 1;

    } else {

        button.textContent = "X";
        activePlayer -= 1;

    }

    grandParentElementChildren = Array.from(grandParentElement.children);

    checkForIndividualWinner(parentElement, parentIndex, grandParentElementChildren);

    button.classList.add("square-disabled");

    if (!gameEnded) {
    
        grandParentElementChildren.forEach((child, index) => {

            if (squareContainers[buttonRelativeIndex].classList.contains("square-container-complete")) {

                if (child.classList.contains("square-container-complete")) {

                    child.classList.add("disabled");
                    
                } else {

                    child.classList.remove("disabled");

                }

            } else {

                if (index != buttonRelativeIndex) {

                    child.classList.add("disabled");
        
                } else {
        
                    child.classList.remove("disabled");
        
                }

            }

        });
    }   
}

function checkForIndividualWinner(parentElement, parentIndex, grandParentElementChildren) {

    var isWon = false;

    for (let pattern of winPatterns) {

        let pos1 = Array.from(parentElement.children)[pattern[0]].innerText;
        let pos2 = Array.from(parentElement.children)[pattern[1]].innerText;
        let pos3 = Array.from(parentElement.children)[pattern[2]].innerText;

        if (pos1 !== "" && pos2 !== "" && pos3 !== "" && pos1 === pos2 && pos2 === pos3) {

            parentElement.classList.add("square-container-complete");
            Array.from(parentElement.children)[pattern[0]].classList.add("square-complete");
            Array.from(parentElement.children)[pattern[1]].classList.add("square-complete");
            Array.from(parentElement.children)[pattern[2]].classList.add("square-complete");
            winStates[parentIndex] = pos1;
            console.log(pos1);
            isWon = true;
            checkForWinner(grandParentElementChildren);
            return;

        }

        if (!isWon) {

            // console.log("NOT WON");

        }

    }
    

}

function checkForWinner(grandParentElementChildren) {

    var isWon = false;

    for (let pattern of winPatterns) {

        let pos1 = winStates[pattern[0]];
        let pos2 = winStates[pattern[1]];
        let pos3 = winStates[pattern[2]];

        if (pos1 !== "" && pos2 !== "" && pos3 !== "" && pos1 === pos2 && pos2 === pos3) {

            isWon = true;
            grandParentElementChildren.forEach((child, index) => {
                
                child.classList.add("disabled");

            });
            alert("IS WON");
            gameEnded = true;
            return;

        }

        if (!isWon) {

            // console.log("NOT WON");

        }

    }

}