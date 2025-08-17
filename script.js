const board = (function () {
    const board = [];
    for (let i = 0; i < 3; i++) {
        board[i] = []
        for (let j = 0; j < 3; j++) {
            board[i].push(0);
        }
    }

    //this just checks for a victory; the game controller will handle the actual victory logic
    const checkVictory = function(row, column, playerValue) {
        //only need to check for the just-changed part
        //diagonal
        if ((row === 2 && column == 2)) {
            
        }
    }

    const updateCell = function(row, column, playerValue) {
        //mainly for console
        if (playerValue != 1 || playerValue != 2) {
            return;
        }
        //this validates that the player changes an unchanged cell
        if (board[row][column] == 0)
            board[row][column] = playerValue;
    }
    
    const printBoard = function() {
        console.log(board);
    }

    return {updateCell, printBoard};
})();

function GameController() {

}

const game = GameController();