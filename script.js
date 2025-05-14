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

    console.log("button: ", button, "buttonRelativeIndex: ", buttonRelativeIndex, "parentElement: ", parentElement, "parentIndex: ", parentIndex, "grandParentElement: ", grandParentElement);

    currentBoard = buttonRelativeIndex;
    gameState.activeSubBoard = buttonRelativeIndex;

    if (gameState.currentPlayer == "O") {

        button.textContent = "O";
        gameStates[parentIndex][buttonRelativeIndex] = "O";

        gameState.subBoards[parentIndex][buttonRelativeIndex] = "O";

        gameState.currentPlayer = "X";
        document.getElementsByClassName("current-turn")[0].textContent = gameState.currentPlayer;
        document.documentElement.style.setProperty('--hoverColor', activeColorPallete.colorX);
        button.classList.add("last-square-o");
        previousButton.classList.remove("last-square-x");

    } else {

        button.textContent = "X";
        gameStates[parentIndex][buttonRelativeIndex] = "X";

        gameState.subBoards[parentIndex][buttonRelativeIndex] = "X";

        gameState.currentPlayer = "O";
        document.documentElement.style.setProperty('--hoverColor', activeColorPallete.colorO);
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

        if (computerToMove == true) {
            // document.getElementsByClassName("current-turn")[0].textContent = "WAIT...";
            // grandParentElement.classList.add("wait-for-move");
            // makeComputerMove();

            makeRandomMove();

            computerToMove = false;
            return;

        } else {
            // grandParentElement.classList.remove("wait-for-move");
            return;
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
            console.log("check for global draw")
            checkForWinner(grandParentElementChildren);
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
        console.log("not won")
        if (gameState.globalBoard.every(cell => cell !== "")) {
            alert("DRAW");
            document.getElementsByClassName("current-turn")[0].textContent = "";
            document.getElementsByClassName("game-over")[0].style.display = "block";
        }
    } else {
        console.log("show new game");
        document.getElementsByClassName("current-turn")[0].textContent = "";
        document.getElementsByClassName("game-over")[0].style.display = "block";
    }

}

// PWA //

// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker.register('./sw.js')
//       .then(reg => console.log('Service Worker registered!', reg))
//       .catch(err => console.error('Service Worker registration failed:', err));
//   }
  
  


// MENU //
let settingsShown = false;
function showSettings() {
    if (settingsShown == false) {
        document.getElementById("settings-content").style.display = "block";
        document.getElementById("new-game").style.display = "none";
        document.getElementById("reset-game").style.display = "none";
        document.getElementById("settings-button").textContent = "CLOSE SETTINGS";
        settingsShown = true;
    } else {
        document.getElementById("settings-content").style.display = "none";
        document.getElementById("new-game").style.display = "block";
        document.getElementById("reset-game").style.display = "block";
        document.getElementById("settings-button").textContent = "SETTINGS";
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

const savedTheme = localStorage.getItem('highContrast');
if (savedTheme) {
  document.documentElement.style.colorScheme = savedTheme;
  toggle.checked = savedTheme === 'dark';
}

toggle.addEventListener('change', () => {
    const theme = toggle.checked ? 'dark' : 'light';
    document.documentElement.style.colorScheme = theme;
    localStorage.setItem('highContrast', theme); 
  });

  

/// COLOR PALLETES ///
const standardPallete = {
    backgroundColor:      "#153448",
    textColor:            "#F7F7F7",
    menuButtonColor:      "#C9E4F7",
    squareBorder:         "#3c5b6f",
    lightSquareBorder:    "#C9E4F7",
    disabledSquareBorder: "rgba(201, 228, 247, 0.1)",
    colorO:               "#3498db",
    colorX:               "#ff6666"
};

const earthyCalmPalette = {
    backgroundColor:      "#2E3D25",
    textColor:            "#F4F1DE",
    menuButtonColor:      "#A9CBB7",
    squareBorder:         "#556B2F",
    lightSquareBorder:    "#A9CBB7",
    disabledSquareBorder: "rgba(169, 203, 183, 0.1)",
    colorO:               "#8FBC8F",
    colorX:               "#D2691E"
}

const neonPalette = {
    backgroundColor:      "#181F38",
    textColor:            "#E0FFFA",
    menuButtonColor:      "#5DFDCB",
    squareBorder:         "#2C5364",
    lightSquareBorder:    "#5DFDCB",
    disabledSquareBorder: "rgba(93, 253, 203, 0.1)",
    colorO:               "#00B8A9",
    colorX:               "#FF2E63"
}

const sunsetPalette = {
    backgroundColor:      "#3B1F2B",
    textColor:            "#FFF8E7",
    menuButtonColor:      "#FFB677",
    squareBorder:         "#A23E48",
    lightSquareBorder:    "#FFB677",
    disabledSquareBorder: "rgba(255, 182, 119, 0.1)",
    colorO:               "#FF7043",
    colorX:               "#FFD166"
}

const pastelPalette = {
    backgroundColor:      "#DDE6ED",
    textColor:            "#2E3A59",
    menuButtonColor:      "#89CFF0",
    squareBorder:         "#7A9CC6",
    lightSquareBorder:    "#B0D0F0",
    disabledSquareBorder: "rgba(137, 207, 240, 0.2)",
    colorO:               "#4A90E2",
    colorX:               "#E94F37"
}

const retroArcadePalette = {
    backgroundColor:      "#22223B",
    textColor:            "#F2E9E4",
    menuButtonColor:      "#F26CA7",
    squareBorder:         "#4A4E69",
    lightSquareBorder:    "#F26CA7",
    disabledSquareBorder: "rgba(242, 108, 167, 0.1)",
    colorO:               "#38B6FF",
    colorX:               "#FFDE59"
}

const forestNightPalette = {
    backgroundColor:      "#232D23",
    textColor:            "#D6E5E3",
    menuButtonColor:      "#7CA982",
    squareBorder:         "#3C5A3A",
    lightSquareBorder:    "#7CA982",
    disabledSquareBorder: "rgba(124, 169, 130, 0.1)",
    colorO:               "#A3C1AD",
    colorX:               "#D9853B"
}

const blackPalette = {
    backgroundColor:      "#000000",
    textColor:            "#FFFFFF",
    menuButtonColor:      "#333333",
    squareBorder:         "#555555",
    lightSquareBorder:    "#777777",
    disabledSquareBorder: "rgba(255, 255, 255, 0.1)",
    colorO:               "#00FFFF",
    colorX:               "#FF4500"
}

const whitePalette = {
    backgroundColor:      "#FFFFFF",
    textColor:            "#222222",
    menuButtonColor:      "#DDDDDD",
    squareBorder:         "#AAAAAA",
    lightSquareBorder:    "#EEEEEE",
    disabledSquareBorder: "rgba(34, 34, 34, 0.1)",
    colorO:               "#007ACC",
    colorX:               "#D9534F"
}

const activeColorPallete = standardPallete;
const palettes = {
    standardPallete,
    earthyCalmPalette,
    neonPalette,
    sunsetPalette,
    pastelPalette,
    retroArcadePalette,
    forestNightPalette,
    blackPalette,
    whitePalette
  };
  
const colorPalletes = [
    { id: "standardPallete", label: "Standard" },
    { id: "earthyCalmPalette", label: "Earthy Calm" },
    { id: "neonPalette", label: "Neon" },
    { id: "sunsetPalette", label: "Sunset" },
    { id: "pastelPalette", label: "Pastel" },
    { id: "retroArcadePalette", label: "Retro Arcade" },
    { id: "forestNightPalette", label: "Forest Night" },
    { id: "blackPalette", label: "Black" },
    { id: "whitePalette", label: "White" }
  ];

  const radioList = document.getElementById('theme-radio-list');
  colorPalletes.forEach((palette, i) => {
    const label = document.createElement('label');
    label.className = 'theme-radio-label';
  
    const input = document.createElement('input');
    input.type = 'radio';
    input.name = 'theme-selection';
    input.value = palette.id;
    input.id = `theme-radio-${palette.id}`;
    if (i === 0) input.checked = true;
  
    const span = document.createElement('span');
    span.textContent = palette.label;
  
    label.appendChild(input);
    label.appendChild(span);
    radioList.appendChild(label);
  });

  const themeRadios = document.querySelectorAll('input[name="theme-selection"]');

  themeRadios.forEach(radio => {
    radio.addEventListener('change', function() {
      if (this.checked) {
        document.documentElement.style.setProperty('--backgroundColor', palettes[this.value].backgroundColor);
        document.documentElement.style.setProperty('--textColor', palettes[this.value].textColor);
        document.documentElement.style.setProperty('--menuButtonColor', palettes[this.value].menuButtonColor);
        document.documentElement.style.setProperty('--squareBorder', palettes[this.value].squareBorder);
        document.documentElement.style.setProperty('--lightSquareBorder', palettes[this.value].lightSquareBorder);
        document.documentElement.style.setProperty('--disabledSquareBorder', palettes[this.value].disabledSquareBorder);
        document.documentElement.style.setProperty('--colorO', palettes[this.value].colorO);
        document.documentElement.style.setProperty('--colorX', palettes[this.value].colorX);
      }
    });
  });


  
/// RANDOM MOVE ///
function makeRandomMove() {

    computerToMove = true;

    const moves = getValidMoves(gameState);
    let randomMove = moves[Math.floor(Math.random() * moves.length)];
    let buttonIndex;

    if (randomMove.subBoard > 0) {
        buttonIndex = randomMove.cell + (9 * randomMove.subBoard);
    } else {
        buttonIndex = randomMove.cell;
    }

    button = document.getElementsByClassName("square")[buttonIndex];
    buttonRelativeIndex = randomMove.cell;
    parentElement = document.getElementsByClassName("square-container")[randomMove.subBoard]
    parentIndex = randomMove.subBoard;
    grandParentElement = document.getElementsByClassName("game-container")[0];

    handleClick(button, buttonRelativeIndex, parentElement, parentIndex, grandParentElement);
}



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
        this.draws = 0;
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