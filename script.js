const board = (function () {
    const board = [];
    for (let i = 0; i < 9; i++) {
        board.push(0);
    }

    const checkAllEqual = function (indicesList, playerValue) {
        return indicesList.every(index => board[index] == playerValue);
    }

    //this just checks for a victory; the game controller will handle the actual victory logic
    const checkVictory = function (index, playerValue) {
        const permutations = [[0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8]];
        //only need to check for the player who just moved and the cell they chose
        const possiblePermutations = permutations.filter(p => p.includes(index));
        //check if at least one of the permutations has been solved
        return possiblePermutations.some(p => checkAllEqual(p, playerValue))
    }

    //returns whether an update was successful
    const updateCell = function (index, playerValue) {
        //mainly for console
        if (playerValue != 1 && playerValue != 2) {
            return false;
        }
        //this validates that the player changes an unchanged cell and also that the index is between 0 and 9
        if (board[index] != 0) {
            console.log("Not a valid cell index, try again");
            return false;
        }

        board[index] = playerValue;
        return true;
    }

    const checkTie = function () {
        return (board.every(cell => cell != 0));
    }

    const printBoard = function () {
        console.log(`${board[0]} ${board[1]} ${board[2]}`);
        console.log(`${board[3]} ${board[4]} ${board[5]}`);
        console.log(`${board[6]} ${board[7]} ${board[8]}`);
    }

    const resetBoard = function () {
        board.forEach((i, index) => board[index] = 0);
        console.log("Board has been reset");
        printBoard();
    }

    return { updateCell, checkVictory, checkTie, printBoard, resetBoard };
})();

function Player(name, value) {
    let score = 0;
    const updateScore = function () {
        score++;
        console.log(`${name} just won and now has ${score} points!`);
    }
    const getScore = function() {
        return score;
    }
    const getName = function () {
        return name;
    }
    const setName = function (newName) {
        name = newName;
    }
    const getValue = function () {
        return value;
    }
    const setValue = function (v) {
        value = v;
    }
    return { getScore, updateScore, getName, setValue, getValue, setName };
}

//use displaycontroller to set names through dom later
function GameController(name1 = "Player 1", name2 = "Player 2", swapEachRound = true) {
    const players = [Player(name1, 1), Player(name2, 2)];
    let activePlayer = players[0];
    let newGame = false;

    const isNewGame = function () {
        return newGame;
    }

    const switchPlayerTurn = function () {
        activePlayer = activePlayer === players[0] ? players[1] : players[0];
    }

    const getActivePlayer = function () {
        return activePlayer;
    }

    const switchPlayerValues = function () {
        let temp = players[1].getValue();
        players[1].setValue(players[0].getValue());
        players[0].setValue(temp)
    }

    const printBeforeRound = function () {
        console.log(`It's ${activePlayer.getName()}'s turn.`);
        board.printBoard();
    }

    const setSwapEachRound = function () {
        swapEachRound = !swapEachRound;
    }

    const restartGame = function () {
        board.resetBoard();
        newGame = true;
    }

    //this now basically returns if it's ok to change a cell's content. return is the player who just made a move, if they were able to make one
    const playRound = function (index) {
        //whoever is X/goes first is determined by whoever has a value of 1
        if (newGame) {
            if (swapEachRound) {
                switchPlayerValues();
            }
            activePlayer = players[0].getValue() == 1 ? players[0] : players[1];
            board.resetBoard(); //moved here so that the player can see the board after the game ends
            newGame = false;
        }

        let value = activePlayer.getValue();
        let currentPlayer = activePlayer;

        let properMove = board.updateCell(index, value);
        switchPlayerTurn();
        printBeforeRound();
        //don't proceed with an invalid move
        if (!properMove) {
            printBeforeRound()
            //have to switch the player back to the current one since they didn't actually make a move. 
            switchPlayerTurn();
            return;
        } //if the active player wins, or a tie
        else if (board.checkVictory(index, value) || board.checkTie()) {
            console.log("Match over!");
            if (board.checkVictory(index, value)) {
                currentPlayer.updateScore();
            }
            newGame = true; //for swapping freely with GUI
        }

        return currentPlayer;
    }

    printBeforeRound();

    return { players, playRound, getActivePlayer, setSwapEachRound, isNewGame, switchPlayerValues, restartGame };
}

const getMarker = function (value) {
    return value == 1 ? 'X' : 'O';
}

const displayController = (function () {
    const game = GameController();

    const container = document.querySelector(".container");
    const cells = document.querySelectorAll(".cell");
    const root = document.documentElement; //for colors
    const gameResult = document.querySelector(".game-result");
    const scoreOne = document.querySelector(".score-one");
    const scoreTwo = document.querySelector(".score-two");
    const nameOne = document.querySelector(".name-one");
    const nameTwo = document.querySelector(".name-two");

    const nameOneInput = document.querySelector("#name-one-input");
    const nameTwoInput = document.querySelector("#name-two-input");
    const closeDialogButton = document.querySelector("#dialog-close");
    const confirmDialogButton = document.querySelector("#dialog-confirm");
    const settingsButton = document.querySelector("#settings");
    const restartButton = document.querySelector("#restart");
    const dialog = document.querySelector("dialog");


    cells.forEach((cell, index) => {
        cell.dataset.id = index
    });

    const clearCells = function () {
        cells.forEach(cell => {
            cell.textContent = ""
            cell.className = "cell";
        });
        updateGameStateDisplay(game.getActivePlayer());
    }

    const writeToBoard = function (e) {
        if (game.isNewGame()) {
            clearCells();
        }
        //if true, the current player was able to make a move, so now it's moved on to the other player's turn.
        const currentPlayer = game.playRound(+e.target.dataset.id);
        if (currentPlayer) {
            let marker = getMarker(currentPlayer.getValue());
            e.target.textContent = marker;
            e.target.classList.add(marker);
            //this is to style the background. the players can choose their own color
            if (currentPlayer === game.players[0])
                e.target.classList.add("player-one");
            else if (currentPlayer === game.players[1])
                e.target.classList.add("player-two");
            //updating score
            scoreTwo.textContent = game.players[1].getScore();
            scoreOne.textContent = game.players[0].getScore();
            //if current player just won
            if (game.isNewGame()) {
                if (!board.checkTie())
                    updateGameStateDisplay(currentPlayer, "win");
                else
                    updateGameStateDisplay(currentPlayer, "tie");
            }
            else {
                updateGameStateDisplay(game.getActivePlayer());
            }
        }
    }

    const updateGameStateDisplay = function (player, state="update") {
        if (state === "tie") 
            gameResult.textContent = "Game over. It was a tie!"
        else if (state === "win") {
            gameResult.textContent = "Game over. " + player.getName() + " won!"
        }
        //when modal is used to change the names
        else if (state === "update") {
            gameResult.textContent = player.getName() + "'s turn";
        }
    }

    const updateNameDisplay = function(e) {
        e.preventDefault();
        game.players[0].setName(nameOneInput.value);
        game.players[1].setName(nameTwoInput.value);
        nameOne.textContent = nameOneInput.value;
        nameTwo.textContent = nameTwoInput.value;
        updateGameStateDisplay(game.getActivePlayer());
        dialog.close();
    }

    container.addEventListener("click", writeToBoard);
    confirmDialogButton.addEventListener("click", updateNameDisplay);
    settingsButton.addEventListener("click", () => {
        nameOneInput.value = game.players[0].getName();
        nameTwoInput.value = game.players[1].getName();
        dialog.showModal();
    })
    restartButton.addEventListener("click", clearCells);

    clearCells();

    return {game};
})();