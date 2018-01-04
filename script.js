const winCon=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];
let chk;
let scorecard={User:0,
Ai:0,
Tie:0};
let humanPlayer=null;
let aiPlayer=null;
const cells=document.getElementsByTagName("td");
const assign=(x,y)=>{
    humanPlayer=x;
    aiPlayer=y;
    startGame();
};
const one=()=>{
    document.getElementById("bt1").disabled=true;
    document.getElementById("bt2").disabled=true;
}
const startGame=()=>{
    setTimeout(()=>{    document.getElementById('msg').innerHTML="User:"+scorecard.User;
    setTimeout(()=>{    document.getElementById('msg').innerHTML="Ai:"+scorecard.Ai;
    setTimeout(()=>{    document.getElementById('msg').innerHTML="Tie:"+scorecard.Tie;
    setTimeout(()=>{    document.getElementById('msg').innerHTML='Reset';
},1000)
},1000);
},1000);
},1000);
            document.getElementById('msg').innerHTML='Reset';

    document.getElementById('msg').addEventListener('click',startGame);
    chk=[0,1,2,3,4,5,6,7,8];
    for(var i=0;i<cells.length;i++){
        cells[i].innerHTML="";
        cells[i].style.color="white";
        cells[i].addEventListener("click",mark,false);
    }
}
function mark(square) {
    if (typeof chk[square.target.id] == 'number') {
        turn(square.target.id, humanPlayer)
        if (!checkWin(chk, humanPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
    }
}

function turn(squareId, player) {
    chk[squareId] = player;
    document.getElementById(squareId).innerText = player;
    let gameWon = checkWin(chk, player)
    if (gameWon) gameOver(gameWon)
}

function checkWin(board, player) {
    let plays = board.reduce((a, e, i) =>
        (e === player) ? a.concat(i) : a, []);
    let gameWon = null;
    for (let [index, win] of winCon.entries()) {
        if (win.every(elem => plays.indexOf(elem) > -1)) {
            gameWon = {index: index, player: player};
            break;
        }
    }
    return gameWon;
}

function gameOver(gameWon) {
    for (let index of winCon[gameWon.index]) {
        document.getElementById(index).style.color =
            gameWon.player == humanPlayer ? "blue" : "red";
    }
    for (var i = 0; i < cells.length; i++) {
        cells[i].removeEventListener('click', mark, false);
    }
    gameWon.player == humanPlayer ? scorecard.player++ : scorecard.Ai++;
    declareWinner(gameWon.player == humanPlayer ? "You win!" : "You lost");
}

function declareWinner(who) {
    document.getElementById("msg").innerHTML=who;
    setTimeout(()=>{
        document.getElementById("msg").innerHTML="Reset";
    },3000);
}

function emptySquares() {
    return chk.filter(s => typeof s == 'number');
}

function bestSpot() {
    return minimax(chk, aiPlayer).index;
}

function checkTie() {
    if (emptySquares().length == 0) {
        for (var i = 0; i < cells.length; i++) {
            cells[i].style.color = "white";
            cells[i].removeEventListener('click', mark, false);
        }
        scorecard.Tie++;
        declareWinner("Tie Game!")
        return true;
    }
    return false;
}

function minimax(newBoard, player) {
    var availSpots = emptySquares(newBoard);

    if (checkWin(newBoard, humanPlayer)) {
        return {score: -10};
    } else if (checkWin(newBoard, aiPlayer)) {
        return {score: 10};
    } else if (availSpots.length === 0) {
        return {score: 0};
    }
    var moves = [];
    for (var i = 0; i < availSpots.length; i++) {
        var move = {};
        move.index = newBoard[availSpots[i]];
        newBoard[availSpots[i]] = player;

        if (player == aiPlayer) {
            var result = minimax(newBoard, humanPlayer);
            move.score = result.score;
        } else {
            var result = minimax(newBoard, aiPlayer);
            move.score = result.score;
        }

        newBoard[availSpots[i]] = move.index;

        moves.push(move);
    }

    var bestMove;
    if(player === aiPlayer) {
        var bestScore = -10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score > bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    } else {
        var bestScore = 10000;
        for(var i = 0; i < moves.length; i++) {
            if (moves[i].score < bestScore) {
                bestScore = moves[i].score;
                bestMove = i;
            }
        }
    }

    return moves[bestMove];
}