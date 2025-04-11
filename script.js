// GAME //

const gameState = {
    globalBoard: ["", "", "", "", "", "", "", "", ""],
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
    activeSubBoard: null,
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

    document.getElementById("menu-container").style.display = "none";
    document.getElementsByClassName("game-over")[0].style.display = "none";

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
        square.classList.remove("last-square-x");
        square.classList.remove("last-square-o");
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

            gameState.globalBoard[parentIndex] = pos1;

            // console.log(pos1);
            isWon = true;
            checkForWinner(grandParentElementChildren);
            return;

        }
    }

    if (!isWon) {
        // console.log("NOT WON");
        const allSquares = Array.from(parentElement.children).every((square) => square.innerText !== "");
        if (allSquares) {
            winStates[parentIndex] = "D";

            gameState.globalBoard[parentIndex] = "D";                                                                                                  
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
            if (gameState.currentPlayer == "O") {
                alert("X WON");
            } else {
                alert("O WON");
            }
            document.getElementsByClassName("current-turn")[0].textContent = "";
            document.getElementsByClassName("game-over")[0].style.display = "block";
            gameEnded = true;
            return;

        } 

    }

    if (!isWon) {
        if (gameState.globalBoard.every(cell => cell !== "")) {
            alert("DRAW");
        }
    } else {
        console.log("show new game");
        document.getElementsByClassName("current-turn")[0].textContent = "";
        document.getElementsByClassName("game-over")[0].style.display = "block";
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


/// MONTE CARLO TREE SEARCH ///

// GET VALID MOVES //

//returns an Array of Objects each containing a subBoard and cell with the index
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

function checkWin(board) {
    for (const line of winPatterns) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    return null;
}

function checkWinGlobal(board) {
    for (const line of winPatterns) {
        const [a, b, c] = line;
        if (board[a] && board[a] === board[b] && board[a] === board[c]) {
            return board[a];
        }
    }
    if (board.every(cell => cell !== "")) {
        return "D";
    }
    return null;
}

// GET VALID MOVES END //


// NODE //

class Node {
    constructor(state, parent = null, move = null) {
        this.state = state; // The game state at this node
        this.parent = parent; // Parent node
        this.children = []; // Child nodes
        this.visits = 0; // Number of times this node has been visited
        this.wins = 0; // Number of wins from this node
        this.move = move; // The move that led to this state
    }

    isFullyExpanded() {
        return this.children.length === getValidMoves(this.state).length;
    }
}

// SELECT //

function select(node) {
    while (node.children.length > 0) {
        node = node.children.reduce((bestChild, child) => {
            const ucb1 = (child.wins / (child.visits || 1)) + 
                         Math.sqrt(2 * Math.log(node.visits + 1) / (child.visits || 1));
            return ucb1 > bestChild.ucb1 ? { node: child, ucb1 } : bestChild;
        }, { node: null, ucb1: -Infinity }).node;
    }
    return node;
}

// EXPAND //

function expand(node) {

    if (node.isFullyExpanded()) {
        return null; // No expansion needed if all moves are already explored
    }

    const validMoves = getValidMoves(node.state);

    // console.log(validMoves);

    const triedMoves = node.children.map(child => child.move);

    for (const move of validMoves) {
        // console.log(node.state.currentPlayer)
        if (!triedMoves.some(m => m.subBoard === move.subBoard && m.cell === move.cell)) {
            // console.log("APPLY MOVE EXPAND: ", move, node.state);
            const newState = applyMove(node.state, move);
            const childNode = new Node(newState, node, move);
            node.children.push(childNode);
            return childNode;
        }
    }
}

// SIMULATE //

function simulate(state) {
    // let currentState = JSON.parse(JSON.stringify(state));
    let currentState = state;
    while (!isGameOver(currentState)) {
        const moves = getValidMoves(currentState);
        const randomMove = moves[Math.floor(Math.random() * moves.length)];
        // console.log("APPLY MOVE SIMULATE: ", randomMove);
        currentState = applyMove(currentState, randomMove);
    }
    return checkWinGlobal(currentState.globalBoard); // Returns 'X', 'O', 'D' or null for still going.
}

function isGameOver(state) {
    return checkWinGlobal(state.globalBoard) != null
}


// IF win is found in a subBoard we need to update the globalBoard aswell!!!

function applyMove(state, move) {

    // console.log(move);
    // console.log(state, move)
    let newState = state;
    newState.activeSubBoard = move.subBoard;
    newState.subBoards[move.subBoard][move.cell] = state.currentPlayer;
    // console.log(newState)
    let winState = checkWin(state.subBoards[move.subBoard]);
    if (winState != null) {
        state.globalBoard[move.subBoard] = winState;
    }
    state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
    return newState;

}

// BACK PROGAGATE //

function backpropagate(node, result, lookingFor) {
    // console.log(result, node.state.currentPlayer)

    // node.state.currentPlayer = node.state.currentPlayer === "X" ? "O" : "X";

    while (node !== null) {
        node.visits++;
        // console.log("NODE STATE CURRENTPLAYER: ", node.state.currentPlayer, " RESULT: ", result, " WINs", node.wins);
        // if (node.state.currentPlayer === result) {
        if (lookingFor === result) {
            node.wins++;
        }
        node = node.parent;
    }
}

// MCTS //

function monteCarloTreeSearch(rootState, iterations) {

    const searchState = JSON.parse(JSON.stringify(rootState));

    const lookingFor = searchState.currentPlayer;

    const rootNode = new Node(searchState);

    for (let i = 0; i < iterations; i++) {
        let node = select(rootNode); // Selection
        if (!isGameOver(node.state)) {
            node = expand(node); // Expansion
        }
        const result = simulate(node.state); // Simulation
        backpropagate(node, result, lookingFor); // Backpropagation
    }
    console.log("FINAL STATE: ", rootNode, " looked for: ", lookingFor);
    return rootNode.children.reduce((bestChild, child) => 
        child.visits > bestChild.visits ? child : bestChild).move;
}