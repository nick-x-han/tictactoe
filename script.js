const board = (function () {
    const board = [];
    for (let i = 0; i < 9; i++) {
        board.push(i);
    }

    const checkAllEqual = function(indicesList, playerValue) {
        return indicesList.every(index => index == playerValue);
    }

    //this just checks for a victory; the game controller will handle the actual victory logic
    const checkVictory = function(index, playerValue) {
        const permutations = [[0, 4, 8], [2, 4, 6], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 1, 2], [3, 4, 5], [6, 7, 8]];
        //only need to check for the player who just moved and the cell they chose
        const possiblePermutations = permutations.filter(p => p.includes(index));
        //check if at least one of the permutations has been solved
        return possiblePermutations.some(p => checkAllEqual(p, playerValue))
    }

    //returns whether an update was successful
    const updateCell = function(index, playerValue) {
        //mainly for console
        if (playerValue != 1 || playerValue != 2) {
            return false;
        }
        //this validates that the player changes an unchanged cell
        if (board[index] != 0) return false;
        
        board[index] = playerValue;
        return true;
    }
    
    const printBoard = function() {
        console.log(board);
    }

    return {updateCell, checkVictory, printBoard};
})();

function Player(name, value) {
    let score = 0;
    const updateScore = function () {
        score++;
    }
    const getName = function() {
        return name;
    }
    const getValue = function() {
        return value;
    }
    return {updateScore, getName, getValue};
}

//use displaycontroller to set names through dom later
function GameController(name1, name2) {
    
}