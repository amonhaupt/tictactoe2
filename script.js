// GAME //

const gameState = {
    globalBoards: ["", "", "", "", "", "", "", "", ""], // Tracks wins in sub-boards
    subBoards: [
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""],
        ["", "", "", "", "", "", "", "", ""]
    ],
    currentPlayer: 'X',
    activeSubBoard: null // Index of the sub-board to play in
};


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
let playingAgainstComputer = false;
let computerToMove = false;
let computerDifficulty = 2;
let winStates;
let gameEnded;
let gameStates;
let currentBoard;
// let currentPlayer;
let squares = document.querySelectorAll(".square");
let squareContainers = document.querySelectorAll(".square-container");

function resetGame() {

    winStates = ["","","","","","","","",""];
    gameStates = [
        ["", "", "","", "", "","", "", ""],
        ["", "", "","", "", "","", "", ""],
        ["", "", "","", "", "","", "", ""],
        ["", "", "","", "", "","", "", ""],
        ["", "", "","", "", "","", "", ""],
        ["", "", "","", "", "","", "", ""],
        ["", "", "","", "", "","", "", ""],
        ["", "", "","", "", "","", "", ""],
        ["", "", "","", "", "","", "", ""]
    ];
    gameEnded = false;
    gameState.currentPlayer = "X";
    document.getElementsByClassName("current-turn")[0].textContent = gameState.currentPlayer;

    squares.forEach((square) => {
        square.classList.remove("square-disabled");
        square.textContent = "";

    })

    squareContainers.forEach((container) => {
        container.classList.remove("square-container-complete-x");
        container.classList.remove("square-container-complete-o");
        container.classList.remove("square-container-complete-d");
        container.classList.remove("disabled");
    })
}
resetGame()

squares.forEach((square, index) => {
    square.addEventListener('click', function(event) {
        const button = event.target;
        const parentElement = event.target.parentElement;
        const grandParentElement = event.target.parentElement.parentElement;
        const buttonRelativeIndex = (index - (9 * Array.from(event.target.parentElement.parentElement.children).indexOf(event.target.parentElement)));
        const alsoButtonRelativeIndex = (Array.from(event.target.parentElement.children).indexOf(event.target));
        const parentIndex = Array.from(event.target.parentElement.parentElement.children).indexOf(event.target.parentElement);

        handleClick(button, buttonRelativeIndex, parentElement, parentIndex, grandParentElement, computerToMove);
    });
});

var previousButton = document.createElement("button");
function handleClick(button, buttonRelativeIndex, parentElement, parentIndex, grandParentElement, computerMove) {

    // console.log(button, buttonRelativeIndex, parentElement, parentIndex, grandParentElement);

    currentBoard = buttonRelativeIndex;
    gameState.activeSubBoard = buttonRelativeIndex;

    if (gameState.currentPlayer == "O") {

        button.textContent = "O";
        gameStates[parentIndex][buttonRelativeIndex] = "O";

        gameState.subBoards[parentIndex][buttonRelativeIndex] = "O";

        gameState.currentPlayer = "X";
        document.getElementsByClassName("current-turn")[0].textContent = gameState.currentPlayer;
        button.classList.add("last-square-o");
        previousButton.classList.remove("last-square-x");

    } else {

        button.textContent = "X";
        gameStates[parentIndex][buttonRelativeIndex] = "X";

        gameState.subBoards[parentIndex][buttonRelativeIndex] = "X";

        gameState.currentPlayer = "O";
        document.getElementsByClassName("current-turn")[0].textContent = gameState.currentPlayer;

        button.classList.add("last-square-x");
        previousButton.classList.remove("last-square-o");

    }

    previousButton = button;   

    grandParentElementChildren = Array.from(grandParentElement.children);

    checkForIndividualWinner(parentElement, parentIndex, grandParentElementChildren);

    button.classList.add("square-disabled");

    if (!gameEnded) {
    
        grandParentElementChildren.forEach((child, index) => {

            if (squareContainers[buttonRelativeIndex].classList.contains("square-container-complete-x") || squareContainers[buttonRelativeIndex].classList.contains("square-container-complete-o") || squareContainers[buttonRelativeIndex].classList.contains("square-container-complete-d")) {

                if (child.classList.contains("square-container-complete-x") || child.classList.contains("square-container-complete-o") || child.classList.contains("square-container-complete-d")) {

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

        if (computerMove == true) {
            document.getElementsByClassName("current-turn")[0].textContent = "WAIT...";
            grandParentElement.classList.add("wait-for-move");
            makeComputerMove();
        } else {
            grandParentElement.classList.remove("wait-for-move");
        }
    }

}

function checkForIndividualWinner(parentElement, parentIndex, grandParentElementChildren) {

    var isWon = false;

    for (let pattern of winPatterns) {

        let pos1 = Array.from(parentElement.children)[pattern[0]].innerText;
        let pos2 = Array.from(parentElement.children)[pattern[1]].innerText;
        let pos3 = Array.from(parentElement.children)[pattern[2]].innerText;

        if (pos1 !== "" && pos2 !== "" && pos3 !== "" && pos1 === pos2 && pos2 === pos3) {

            if (gameState.currentPlayer == "O") {
                parentElement.classList.add("square-container-complete-x");
            } else {
                parentElement.classList.add("square-container-complete-o");
            }
            
            // parentElement.replaceChildren();

            // Array.from(parentElement.children)[pattern[0]].classList.add("square-complete");
            // Array.from(parentElement.children)[pattern[1]].classList.add("square-complete");
            // Array.from(parentElement.children)[pattern[2]].classList.add("square-complete");
            winStates[parentIndex] = pos1;

            gameState.globalBoards[parentIndex] = pos1;

            console.log(pos1);
            isWon = true;
            checkForWinner(grandParentElementChildren);
            return;

        }
    }

    if (!isWon) {

        // console.log("NOT WON");
        const allSquares = Array.from(parentElement.children).every((square) => square.innerText !== "");
        if (allSquares) {
            parentElement.classList.add("square-container-complete-d");
            // parentElement.replaceChildren();
            // Array.from(parentElement.children).forEach(child => {
            //     child.style.display = "none";
            // })
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
            if (gameState.currentPlayer == "X") {
                alert("X WON");
            } else {
                alert("O WON");
            }
            gameEnded = true;
            return;

        }

    }

    if (!isWon) {

        // console.log("NOT WON");

    }

}

// MENU //
let settingsShown = false;
function showSettings() {
    if (settingsShown == false) {
        document.getElementById("settings-content").style.display = "block";
        settingsShown = true;
    } else {
        document.getElementById("settings-content").style.display = "none";
        settingsShown = false;
    }
}

// Get the menu
var menu = document.getElementById("menu-container");

// Get the button that opens the modal
var menuButton = document.getElementById("menu-button");

// Get the <span> element that closes the modal
// var span = document.getElementsByClassName("close-menu")[0];

// When the user clicks on the button, open the modal
menuButton.onclick = function() {
  menu.style.display = "block";
}

// // When the user clicks on <span> (x), close the menu
// span.onclick = function() {
//   menu.style.display = "none";
// }

// When the user clicks anywhere outside of the menu, close it
window.onclick = function(event) {
    if (event.target == menu) {
        menu.style.display = "none";
    }
        
    if (event.target.matches(".button-container") || event.target.matches(".menu-item-container")) {
        document.getElementById("settings-content").style.display = "none";
        settingsShown = false;
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



// COMPUTER MOVES //

function delay(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

function getRandomMove() {
    let randomIndex = Math.floor(Math.random() * 9);
    console.log(gameState.subBoards[gameState.activeSubBoard][randomIndex])
    if (gameState.subBoards[gameState.activeSubBoard][randomIndex] == "") {
        return randomIndex;
    } else {
        getRandomMove()
    }
}



async function makeComputerMove() {
    computerToMove = false;
    // console.log("THINKING");
    let bestMove
    if (computerDifficulty != 2) {
        bestMove = await findBestMove(gameState);
    } else {
        let randomIndex = await getRandomMove();
        
        bestMove = {subBoard : gameState.activeSubBoard, cell : randomIndex};
        console.log(bestMove)
    }


    if (computerDifficulty == 2) {
        await delay(Math.floor(Math.random() * (500 - 200 + 1)) + 200);
        console.log("THINKING...");
    }
    // let bestMove = await findBestMove(gameState);

    // console.log(bestMove);

    let buttonRelativeIndex = bestMove.cell;
    let parentIndex = bestMove.subBoard
    let parentElement = squareContainers[parentIndex];
    let grandParentElement = parentElement.parentElement;
    let button = parentElement.children[buttonRelativeIndex];

    // console.log("MAKING MOVE");
    handleClick(button, buttonRelativeIndex, parentElement, parentIndex, grandParentElement, computerToMove);

    computerToMove = true;
}

/// VALID MOVES ///
function getValidMoves(state) {
    const { activeSubBoard, subBoards } = state;
    if (activeSubBoard !== null && !isSubBoardComplete(subBoards[activeSubBoard])) {
        return getEmptyCells(subBoards[activeSubBoard]).map(cell => ({
            subBoard: activeSubBoard,
            cell
        }));
    }
    return subBoards.flatMap((board, index) => 
        isSubBoardComplete(board) ? [] : getEmptyCells(board).map(cell => ({ subBoard: index, cell }))
    );
}

function getEmptyCells(board) {
    const cells = [];
    board.forEach((cell, index) => {
        if (cell === "") cells.push(index);
    });
    return cells;
}

function isSubBoardComplete(board) {
    return checkWin(board) || board.every(cell => cell !== "");
}


/// EVALUTION ///
function evaluate(state) {
    const { globalBoards } = state;
    const winner = checkWin(globalBoards);
    if (winner == "X") return 100; 
    if (winner == "O") return -100;
    return 0; 
}

function checkWin(board) {
    const winningLines = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], 
        [0, 3, 6], [1, 4, 7], [2, 5, 8],
        [0, 4, 8], [2, 4, 6]            
    ];
    
    for (const line of winningLines) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}


/// MINIMAX ///
function minimax(state, depth, alpha, beta, maximizingPlayer) {
    const winner = checkWin(state.globalBoards);
    if (winner || depth === 0) return evaluate(state);

    const validMoves = getValidMoves(state);
    
    if (maximizingPlayer) {
        let maxEval = -Infinity;
        for (const move of validMoves) {
            const newState = simulateMove(state, move);
            const eval = minimax(newState, depth - 1, alpha, beta, false);
            maxEval = Math.max(maxEval, eval);
            alpha = Math.max(alpha, eval);
            if (beta <= alpha) break;
        }
        return maxEval;
    } else {
        let minEval = Infinity;
        for (const move of validMoves) {
            const newState = simulateMove(state, move);
            const eval = minimax(newState, depth - 1, alpha, beta, true);
            minEval = Math.min(minEval, eval);
            beta = Math.min(beta, eval);
            if (beta <= alpha) break;
        }
        return minEval;
    }
}

function simulateMove(state, move) {
    const newState = JSON.parse(JSON.stringify(state));
    const { subBoard, cell } = move;

    newState.subBoards[subBoard][cell] = state.currentPlayer;

    if (checkWin(newState.subBoards[subBoard])) {
        newState.globalBoards[subBoard] = state.currentPlayer;
    }

    newState.currentPlayer = state.currentPlayer === 'X' ? 'O' : 'X';

    newState.activeSubBoard = newState.globalBoards[cell] ? null : cell;

    return newState;
}

/// FIND BEST MOVE ///
function findBestMove(state) {
    let bestMove = null;
    let bestValue = -Infinity;

    for (const move of getValidMoves(state)) {
        const newState = simulateMove(state, move);
        const moveValue = minimax(newState, 3 /* Depth */, -Infinity, Infinity, false);

        console.log(bestMove, move, moveValue);
        if (moveValue > bestValue) {
            bestValue = moveValue;
            bestMove = move;
        }
    }

    return bestMove;
}
