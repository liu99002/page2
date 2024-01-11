const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart{
    constructor(x, y){
        this.x = x;
        this.y = y;
    }
}

let speed = 8;
let tileCount = 40;
let tileSize = canvas.width / tileCount+18;
let headX = 10;
let headY = 10;
const snakePart = [];
let tailLen = 0;
let appleX = 5;
let appleY = 5;
let xV = 0;
let yV = 0;
let score = 0;
let highScore = parseInt(localStorage.getItem('highScore')) || 0;

function startGame() {
    snakePosition();
    let lose = isOver();
    if(lose){
        document.body.addEventListener('keydown', playAgain);
        return;
    }
    clearScreen();
    checkColli();
    drawApple();
    drawSnake();
    setSpeed();
    drawScore();
    setTimeout(startGame, 1000/speed);
}

function setSpeed() {
    if(score == 5){
        speed = 10;
    }    
}

function isOver() {
    let Over = false;
    if(headX < 1 || headX == 20 || headY < 1 || headY == 20){
        Over = true;
    }
    for(let i = 0; i < snakePart.length; i++){
        if(headX == snakePart[i].x && headY == snakePart[i].y){
            Over = true;
        }
    }
    if(Over){
        if (score > highScore) {
            highScore= score;
        }
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            const value = localStorage.getItem(key);
        }
        sendData()
        ctx.fillStyle = "gray";
        ctx.fillRect(40, 40, 760, 760);
        ctx.fillStyle = "white";
        ctx.font = "150px Poppins";
        ctx.fillText("Game Over!", 40, canvas.height / 2-40);
        ctx.font = "80px Poppins";
        ctx.fillText("再玩一次?", canvas.width / 3.5-10, canvas.height / 2 +90);
        ctx.font = "60px Poppins";
        ctx.fillText("按空白鍵", canvas.width / 2.7-20, canvas.height / 2+190);
    }
    return Over;
}

function drawScore() {
    //設置得分
    let h1Element = document.querySelector('h1');
    // 檢查是否找到 <h1> 元素
    if (h1Element) {
        // 將 <h1> 的內容設置為遊戲分數（score）
        h1Element.textContent = "此次得分: " + score;
    }
}

function clearScreen() {
    // 設定畫布的寬度和高度
    var canvasWidth = 800;
    var canvasHeight = 800;
    // 迴圈繪製交替的黑白矩形
    for (var i = 40; i < canvasWidth; i += 40) {
        for (var j = 40; j < canvasHeight; j += 40) {
            // 決定填滿顏色為黑色或白色，根據奇偶行列來交替
            var fillStyle = (i / 40 + j / 40) % 2 === 0 ? 'DarkSeaGreen' : 'ForestGreen';
            // 設定填滿顏色
            ctx.fillStyle = fillStyle;
            // 繪製一個填滿的矩形
            ctx.fillRect(i, j, 40, 40);
        }
    }
}

function drawSnake() {
    
    ctx.fillStyle = "OrangeRed";
    for(let i = 0; i< snakePart.length; i++){
        let part = snakePart[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize);
    }

    snakePart.push( new SnakePart(headX, headY));
    if(snakePart.length > tailLen){
        snakePart.shift();
    }

    ctx.fillStyle = 'orange';
    ctx.fillRect(headX * tileCount, headY *tileCount, tileSize, tileSize);

}

function drawApple() {
    ctx.fillStyle = "red";
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize);
}

function checkColli() {
    if(appleX === headX && appleY === headY){
        appleX = Math.floor(Math.random() * tileCount/2)+1;
        appleY = Math.floor(Math.random() * tileCount/2)+1;
        if(appleX>19)appleX=19;
        if(appleY>19)appleY=19;
        tailLen ++;
        score ++;
        if(score > 5 && score % 2 == 0){
            speed ++;
        }
    }
}

function snakePosition() {
    headX = headX + xV;
    headY = headY + yV;
}

document.body.addEventListener('keydown', keyDown);

function keyDown(event) {

    //go up
    if(event.keyCode== 38){
        if(yV == 1) 
            return;
        yV = -1;
        xV = 0;
    }

    //go down
    if(event.keyCode == 40){
        if(yV == -1) 
            return;
        yV = 1;
        xV = 0;
    }

    //go left
    if(event.keyCode == 37){
        if(xV == 1) 
            return;
        yV = 0;
        xV = -1;
    }

    //go right
    if(event.keyCode == 39){
        if(xV == -1) 
            return;
        yV = 0;
        xV = 1;
    }
}

function playAgain(event) {
    if(event.keyCode == 32){
        resetGame();
    }
}
// 重置遊戲
function resetGame() {
    headX = 10;
    headY = 10;
    snakePart.length = 0;
    tailLen = 0;
    appleX = 5;
    appleY = 5;
    xV = 0;
    yV = 0;
    score = 0;
    speed = 8;
    startGame();
}

function sendData() {
    const data = {
        "score": highScore
    };
    fetch("/view/scores", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    .then(response => response.json())
    .then(data => {
        console.log('Success:', data);
    })
    .catch((error) => {
        console.error('Error:', error);
    });
}

resetGame();