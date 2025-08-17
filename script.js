const board = (function () {
    const board = [];
    for (let i = 0; i < 9; i++) {
        board.push(0);
    }

    const checkAllEqual = function (indicesList, playerValue) {
        return indicesList.every(index => index == playerValue);
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
        if (playerValue != 1 || playerValue != 2) {
            return false;
        }
        //this validates that the player changes an unchanged cell
        if (board[index] != 0) return false;

        board[index] = playerValue;
        return true;
    }

    const checkTie = function () {
        return (board.every(cell => cell != 0));
    }

    const printBoard = function () {
        console.log(board);
    }

    const resetBoard = function () {
        board.forEach((i, index) => board[index] = 0);
    }

    return { updateCell, checkVictory, checkTie, printBoard, resetBoard };
})();

function Player(name, value) {
    let score = 0;
    const updateScore = function () {
        score++;
        console.log(`${name} just won and now has ${score} points!`);
    }
    const getName = function () {
        return name;
    }
    const getValue = function () {
        return value;
    }
    const setValue = function (v) {
        value = v;
    }
    return { updateScore, getName, setValue, getValue };
}

//use displaycontroller to set names through dom later
function GameController(name1, name2, swapEachRound) {
    const players = [Player(name1, 1), Player(name2, 2)];
    let activePlayer = players[0];
    let newGame = true;

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
        console.log(`It's ${activePlayer}'s turn.`);
        board.printBoard();
    }

    const setSwapEachRound = function () {
        swapEachRound = !swapEachRound;
    }

    const playRound = function (index) {
        //whoever is X/goes first is determined by whoever has a value of 1
        if (newGame) {
            activePlayer = players[0].getValue() == 1 ? players[0] : players[1];
            newGame = false;
        }
        let value = activePlayer.getValue();
        //if the index provided is invalid, have to recall playRound
        if (!board.updateCell(index, value)) return;

        //if the active player wins, or a tie
        if (board.checkVictory(index, value) || board.checkTie()) {
            console.log("Match over!");
            if (board.checkVictory(index, value)) {
                activePlayer.updateScore();
            }
            board.resetBoard();
            if (swapEachRound) {
                switchPlayerValues();
            }
            newGame = true; //for swapping freely with GUI
            printBeforeRound();
            return; 
        }
        switchPlayerTurn();
        printBeforeRound();
    }

    printBeforeRound();

    return { playRound, getActivePlayer, setSwapEachRound, isNewGame, switchPlayerValues };
}

const game = GameController();