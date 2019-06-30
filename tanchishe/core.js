var chessBoard, squareSet;
var direction = {
    DOWN: { x: 0, y: 1},
    UP: { x: 0, y: -1 },
    LEFT: { x: -1, y: 0},
    RIGHT: { x: 1, y: 0}
};
var mainSnakeColor = "#6495ED";
var mainSnake;
var snake = [];
var frame = 40;
var things = [];
var maxThingsSize = 10;
var timer;
//克隆对象
function clone(obj){
    return JSON.parse(JSON.stringify(obj));
}
function Snake(headX, headY, nowToward, length, bgColor) {
    this.snakeBody = [];
    this.nowToward = nowToward;
    this.headMoveX = nowToward.x;
    this.headMoveY = nowToward.y;
    this.bgColor = bgColor;
    this.changeToward = null;
    this.init = function (headX, headY, nowToward, length, bgColor) {
        for (var i = 0; i < length; i++) {
            this.grow(headX, headY, bgColor);
        }
    };
    this.grow = function (headX, headY, bgColor) {
        var ball;
        if (this.snakeBody.length == 0) {
            ball = createBall(headX, headY, ">", mainSnakeColor);
        } else if(this.snakeBody[this.snakeBody.length - 1].point.length == 0){
            var lastBody = this.snakeBody[this.snakeBody.length - 1];
            ball = createBall(lastBody.lx - this.nowToward.x * 20, lastBody.ly - this.nowToward.y * 20, '', mainSnakeColor);
        }else{//有拐点
            var lastBody = this.snakeBody[this.snakeBody.length - 1];
            var point = lastBody.point[0];
            ball = createBall(lastBody.lx - point.speedX * 20, lastBody.ly - point.speedY * 20, '', mainSnakeColor);
            ball.point = clone(lastBody.point);
        }
        this.snakeBody.push(ball);
    };
    this.turnUp = function () {
        change(this, 0, -1,-90);
    };
    this.turnRight = function () {
        change(this, 1, 0,0);
    };
    this.turnLeft = function () {
        change(this, -1, 0,180);
    };
    this.turnDown = function () {
        change(this, 0, 1,90);
    };
    this.over = function () {
        if (mainSnake == this) {
            clearInterval(timer);
            alert('game over');
        } 
    }
    this.init(headX, headY, nowToward, length, bgColor);
}
var thingFactory = {
    autoGenerateTimer: null,
    typeEnums: {
        food: {
            name: 'food',
            value: 2,
            text: '+',
            bgColor: '#228B22',
            fgColor: 'black',
            act(origin) {
                origin.grow(null, null, origin.bgColor);
            }
        }
    },
    createThing(x, y, type) {
        var temp = createBall(x, y, type.text, type.bgColor, type.fgColor);
        temp.value = type.value;
        temp.act = type.act;
        things.push(temp);
        return temp;
    },
    randomGenerate() {
        var x = Math.floor(Math.random() * 480);
        var y = Math.floor(Math.random() * 480);
        var temp = createBall(x, y, this.typeEnums.food.text, this.typeEnums.food.bgColor, this.typeEnums.food.fgColor);
        temp.act = this.typeEnums.food.act;
        things.push(temp);
    },
    autoGenerate() {
        this.autoGenerateTimer = setInterval(function () {
            if (things.length < maxThingsSize) {
                thingFactory.randomGenerate();
            }
        }, 1000);
    }
}
function change(nowSnake, x, y,rotate) {
    var lastX = nowSnake.snakeBody[0].lx;
    var lastY = nowSnake.snakeBody[0].ly;
    var speedX = nowSnake.headMoveX;
    var speedY = nowSnake.headMoveY;
    for (var i = 1; i < nowSnake.snakeBody.length; i++) {
        nowSnake.snakeBody[i].point.push({ x: lastX, y: lastY, speedX, speedY });
    }
    nowSnake.snakeBody[0].style.transform = 'rotate('+rotate+'deg)';
    nowSnake.headMoveX = x;
    nowSnake.headMoveY = y;
}
function createBall(x, y, text, bgColor, fgColor) {
    var ball = document.createElement('div');
    ball.classList.add('ball');
    ball.style.left = x + 'px';
    ball.style.top = y + 'px';
    ball.style.backgroundColor = bgColor;
    ball.style.color = fgColor;
    ball.lx = x;
    ball.ly = y;
    ball.point = [];
    ball.innerText = text;
    chessBoard.appendChild(ball);
    return ball;
}
function initSquareSet() {
    squareSet = new Array(25);
    for (var i = 0; i < 25; i++) {
        squareSet[i] = new Array(25);
        for (var j = 0; j < 25; j++) {
            squareSet[i][j] = document.createElement('div');
            squareSet[i][j].classList.add('square');
            chessBoard.appendChild(squareSet[i][j]);
        }
    }
}
function initSnake() {
    var main = new Snake(80, 0, direction.RIGHT, 3, mainSnakeColor);
    mainSnake = main;
    snake.push(main);
}
function repaint() {
    for (var i = 0; i < snake.length; i++) {
        for (var j = 0; j < snake[i].snakeBody.length; j++) {
            snake[i].snakeBody[j].style.left = snake[i].snakeBody[j].lx + 'px';
            snake[i].snakeBody[j].style.top = snake[i].snakeBody[j].ly + 'px';
        }
    }
}
function move() {
    for (var i = 0; i < snake.length; i++) {
        for (var j = 0; j < snake[i].snakeBody.length; j++) {
            if (snake[i].snakeBody[j].point.length > 0) {
                snake[i].snakeBody[j].lx += snake[i].snakeBody[j].point[0].speedX;
                snake[i].snakeBody[j].ly += snake[i].snakeBody[j].point[0].speedY;
                if (snake[i].snakeBody[j].lx == snake[i].snakeBody[j].point[0].x && snake[i].snakeBody[j].ly == snake[i].snakeBody[j].point[0].y) {
                    snake[i].snakeBody[j].point.shift();
                }
            } else {
                snake[i].snakeBody[j].lx += snake[i].headMoveX;
                snake[i].snakeBody[j].ly += snake[i].headMoveY;
            }

        }
    }
    repaint();
}
function tryChangeToward() {
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].changeToward && snake[i].changeToward.change != snake[i].nowToward) {
            if (snake[i].changeToward.change.x + snake[i].nowToward.x != 0 || snake[i].changeToward.change.x + snake[i].nowToward.x != 0) {
                snake[i].nowToward = snake[i].changeToward.change;
                snake[i].changeToward.act.call(snake[i])
            }
        }
    }
}
function getDistance(a, b) {
    var snakeCenterX = a.lx + 10;
    var snakeCenterY = a.ly + 10;
    var thingsCenterX = b.lx + 10;
    var thingsCenterY = b.ly + 10;
    var absX = Math.abs(snakeCenterX - thingsCenterX);
    var absY = Math.abs(snakeCenterY - thingsCenterY);
    var distance = Math.sqrt(Math.pow(absX, 2) + Math.pow(absY, 2), 2);
    return distance;
}
function checkCrash() {
    for (var i = 0; i < snake.length; i++) {
        var x = snake[i].snakeBody[0].lx;
        var y = snake[i].snakeBody[0].ly;
        if (x < 0 || x > 480 || y < 0 || y > 480) {
            snake[i].over();
            continue;
        }
        for (var j = 0; j < things.length; j++) {
            var distance = getDistance(snake[i].snakeBody[0], things[j]);
            if (distance < 20) {
                things[j].act(snake[i]);
                chessBoard.removeChild(things[j]);
                things.splice(j,1);
            }
        }
    }
}
function start() {
    timer = setInterval(function () {
        tryChangeToward();
        move();
        checkCrash();
    }, 1000 / frame);
    thingFactory.autoGenerate();
   
    document.onkeydown = e => {
        if (e.keyCode == 38) {
            mainSnake.changeToward = { change: direction.UP, act: mainSnake.turnUp };
        }
        if (e.keyCode == 40) {
            mainSnake.changeToward = { change: direction.DOWN, act: mainSnake.turnDown };
        }
        if (e.keyCode == 37) {
            mainSnake.changeToward = { change: direction.LEFT, act: mainSnake.turnLeft };
        }
        if (e.keyCode == 39) {
            mainSnake.changeToward = { change: direction.RIGHT, act: mainSnake.turnRight };
        }
    }
}
window.onload = function () {
    chessBoard = document.getElementById('chess_board');
    //初始化棋盘
    initSquareSet();
    //初始化蛇
    initSnake();
}