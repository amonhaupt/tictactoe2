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

            if (squareContainers[buttonRelativeIndex].classList.contains("square-container-complete-x") || squareContainers[buttonRelativeIndex].classList.contains("square-container-complete-o")) {

                if (child.classList.contains("square-container-complete-x") || child.classList.contains("square-container-complete-o")) {

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

            if (activePlayer == 0) {
                parentElement.classList.add("square-container-complete-x");
            } else {
                parentElement.classList.add("square-container-complete-o");
            }
            
            parentElement.replaceChildren();

            // Array.from(parentElement.children)[pattern[0]].classList.add("square-complete");
            // Array.from(parentElement.children)[pattern[1]].classList.add("square-complete");
            // Array.from(parentElement.children)[pattern[2]].classList.add("square-complete");
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
            if (activePlayer == 0) {
                alert("X WON");
            } else {
                alert("O WON");
            }
            gameEnded = true;
            return;

        }

        if (!isWon) {

            // console.log("NOT WON");

        }

    }

}


// Get the settings
var settings = document.getElementById("settings");

// Get the button that opens the modal
var settingsButton = document.getElementById("settings-button");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close-settings")[0];

// When the user clicks on the button, open the modal
settingsButton.onclick = function() {
  settings.style.display = "block";
}

// When the user clicks on <span> (x), close the settings
span.onclick = function() {
  settings.style.display = "none";
}

// When the user clicks anywhere outside of the settings, close it
window.onclick = function(event) {
  if (event.target == settings) {
    settings.style.display = "none";
  }
} 

const toggle = document.getElementById('theme-toggle');

const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.style.colorScheme = savedTheme;
  toggle.checked = savedTheme === 'dark';
}

toggle.addEventListener('change', () => {
    const theme = toggle.checked ? 'dark' : 'light';
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('theme', theme); 
  });
