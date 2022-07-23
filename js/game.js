'use strict'

var gLevelBeginner = {
    level: 'beginner',
    size: 4,
    mines: 2,
    time: 10,
    lifes: 1
}

var gLevelMeduim = {
    level: 'meduim',
    size: 8,
    mines: 12,
    time: 20,
    lifes: 2
}

var gLevelExpert = {
    level: 'expert',
    size: 12,
    mines: 30,
    time: 40,
    lifes: 3
}

var gLevel = gLevelBeginner

var gBoard = []

var gTimer

var gLife

var gameOn = null

var flag = false

var isFirstClick = true

function initGame() {
    gameOn = false
    isFirstClick = true
    gLife = gLevel.lifes
    document.getElementById('lifes').innerText = 'LIFE LEFT' + ' ' + gLife
    flag = false
    gBoard = createBoard(gLevel)
    renderBoard(gBoard)
}

function toggleFlag() {
    if (gameOn) {
        flag = (flag) ? false : true
        console.log('flag:', flag)
    }
}

function chooseLevel(num) {
    if (num === 1) {
        gLevel = gLevelBeginner
    }
    if (num === 2) {
        gLevel = gLevelMeduim
    }
    if (num === 3) {
        gLevel = gLevelExpert
    }
    initGame(gBoard, gLevel)
    clearInterval(gTimer)
    return
}

function createBoard(gLevel) {
    var board = []
    for (var i = 0; i < gLevel.size; i++) {
        board[i] = []
        for (var j = 0; j < gLevel.size; j++) {
            var cell = {
                mineAroundCount: 0,
                isShown: false,
                isMine: false,
                isMarked: false
            }
            board[i][j] = cell
        }
    }
    // console.table(board)
    return board
}

function renderBoard(gBoard) {
    var strHTML = ''
    for (var i = 0; i < gBoard.length; i++) {
        strHTML += `<tr class="table-row" >\n`
        for (var j = 0; j < gBoard.length; j++) {
            if (!gBoard[i][j].isShown) {
                strHTML += `\t<td class="tile closed-tile" onclick="onCellClick(this,gBoard,${i},${j})"></td>\n`
            }
            if (!gBoard[i][j].isShown && gBoard[i][j].isMarked) {
                strHTML += `\t<td class="tile with-flag" onclick="onCellClick(this,gBoard,${i},${j})"></td>\n`
            }
            if (!gBoard[i][j].isMine && gBoard[i][j].isShown && gBoard[i][j].mineAroundCount === 0) {
                strHTML += `\t<td class="tile empty" onclick="onCellClick(this,gBoard,${i},${j})"></td>\n`
            }
            if (!gBoard[i][j].isMine && gBoard[i][j].isShown && gBoard[i][j].mineAroundCount > 0) {
                strHTML += `\t<td class="tile with-num" onclick="onCellClick(this,gBoard,${i},${j})">${gBoard[i][j].mineAroundCount}</td>\n`

            }
            if (gBoard[i][j].isMine && gBoard[i][j].isShown) {
                strHTML += `\t<td class="tile with-mine" onclick="onCellClick(this,gBoard,${i},${j})">X</td>\n`
            }
        }
        strHTML += `</tr>\n`
    }
    var elGameContainer = document.querySelector('.grid')
    elGameContainer.innerHTML = strHTML
}

function onCellClick(elCell, gBoard, i, j) {
    if (isFirstClick) {
        gameOn = true
        isFirstClick = false
        gBoard[i][j].isShown = true
        spreadMines(gBoard, gLevel)
        setMinesNegsCount(gBoard)
        renderBoard(gBoard)
        var gameStartTime = Date.now()
        gTimer = setInterval(() => {
            var now = Date.now()
            var gameRunningSec = (now - gameStartTime) / 1000.0
            document.getElementById('timer').innerText = gameRunningSec.toPrecision(2)
            if (gameRunningSec > gLevel.time || gLife === 0) {
                gameOn = false
                console.log("End game")
                clearInterval(gTimer)
            }
        }, 10)
        return
    }
    if (gBoard[i][j].isShown && gameOn) {
        return
    }
    if (!gBoard[i][j].isShown && gameOn) {
        gBoard[i][j].isShown = true
        gLife = (gBoard[i][j].isMine) ? gLife - 1 : gLife
        console.log('gLife:', gLife)
        document.getElementById('lifes').innerText = 'LIFE LEFT' + ' ' + gLife
        renderBoard(gBoard)
    }
}

function setMinesNegsCount() {
    for (var i = 0; i < gBoard.length; i++) {
        for (var j = 0; j < gBoard[0].length; j++) {
            for (var scanI = i - 1; scanI <= i + 1; scanI++) {
                if (scanI < 0 || scanI >= gBoard.length) continue
                for (var scanJ = j - 1; scanJ <= j + 1; scanJ++) {
                    if (scanJ < 0 || scanJ >= gBoard.length) continue
                    if (scanI === i && scanJ === j) continue
                    if (gBoard[scanI][scanJ].isMine) {
                        gBoard[i][j].mineAroundCount++
                    }
                }
            }
        }
    }
}

function spreadMines(board, level) {
    var minesLeft = level.mines
    // console.log('mines-left:', minesLeft)
    while (minesLeft > 0) {
        var randI = getRandomInt(0, board.length)
        var randJ = getRandomInt(0, board.length)
        if (board[randI][randJ].isMine || board[randI][randJ].isShown) continue
        console.log('randI:', randI, 'randj:', randJ)
        board[randI][randJ].isMine = true
        // setMinesNegsCount(gBoard,randI,randJ)
        console.table(gBoard)
        minesLeft--
        console.log('minesleft:', minesLeft)
    }
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min)
}

// function openNegs(gBoard, i, j) {
//     if (gBoard[i][j].mineAroundCount === 0) {
//         for (var idxI = i - 1; idxI <= i + 1; idxI++) {
//             if (idxI < 0 || idxI >= gBoard.length) continue
//             for (var idxJ = j - 1; idxJ <= idxJ + 1; idxJ++) {
//                 console.log(idxI, idxJ)
//             }
//         }
//     }
// }