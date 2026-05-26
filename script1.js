const cells = document.querySelectorAll(".cell");
const statusText = document.getElementById("status");

let board = ["","","","","","","","",""];
let gameOver = false;

let xWins = 0;
let oWins = 0;
let draws = 0;

const winPatterns = [
    [0,1,2],
    [3,4,5],
    [6,7,8],
    [0,3,6],
    [1,4,7],
    [2,5,8],
    [0,4,8],
    [2,4,6]
];

cells.forEach(cell=>{
    cell.addEventListener("click", playerMove);
});

function playerMove(e){

    const index = e.target.dataset.index;

    if(board[index] !== "" || gameOver) return;

    board[index] = "X";

    e.target.textContent = "X";
    e.target.classList.add("x");

    if(checkWinner("X")){

        xWins++;

        document.getElementById("xWins").textContent = xWins;

        statusText.textContent = "🎉 You Win!";

        gameOver = true;
        return;
    }

    if(isDraw()){

        draws++;

        document.getElementById("draws").textContent = draws;

        statusText.textContent = "😅 Draw!";

        gameOver = true;
        return;
    }

    statusText.textContent = "🤖 Computer Thinking...";

    setTimeout(computerMove,500);
}

function computerMove(){

    let bestScore = -Infinity;
    let move;

    for(let i=0;i<9;i++){

        if(board[i] === ""){

            board[i] = "O";

            let score = minimax(board,0,false);

            board[i] = "";

            if(score > bestScore){

                bestScore = score;
                move = i;
            }
        }
    }

    board[move] = "O";

    cells[move].textContent = "O";
    cells[move].classList.add("o");

    if(checkWinner("O")){

        oWins++;

        document.getElementById("oWins").textContent = oWins;

        statusText.textContent = "💀 Computer Wins!";

        gameOver = true;
        return;
    }

    if(isDraw()){

        draws++;

        document.getElementById("draws").textContent = draws;

        statusText.textContent = "😅 Draw!";

        gameOver = true;
        return;
    }

    statusText.textContent = "Your Turn (X)";
}

function minimax(newBoard, depth, isMaximizing){

    if(checkWinnerMini("O", newBoard)) return 10 - depth;

    if(checkWinnerMini("X", newBoard)) return depth - 10;

    if(!newBoard.includes("")) return 0;

    if(isMaximizing){

        let best = -Infinity;

        for(let i=0;i<9;i++){

            if(newBoard[i] === ""){

                newBoard[i] = "O";

                best = Math.max(
                    best,
                    minimax(newBoard, depth + 1, false)
                );

                newBoard[i] = "";
            }
        }

        return best;

    } else {

        let best = Infinity;

        for(let i=0;i<9;i++){

            if(newBoard[i] === ""){

                newBoard[i] = "X";

                best = Math.min(
                    best,
                    minimax(newBoard, depth + 1, true)
                );

                newBoard[i] = "";
            }
        }

        return best;
    }
}

function checkWinner(player){

    return winPatterns.some(pattern=>{

        return pattern.every(index=>{

            return board[index] === player;
        });
    });
}

function checkWinnerMini(player,tempBoard){

    return winPatterns.some(pattern=>{

        return pattern.every(index=>{

            return tempBoard[index] === player;
        });
    });
}

function isDraw(){

    return board.every(cell=>cell !== "");
}

function restartGame(){

    board = ["","","","","","","","",""];

    gameOver = false;

    cells.forEach(cell=>{

        cell.textContent = "";

        cell.classList.remove("x","o");
    });

    statusText.textContent = "Your Turn (X)";
}