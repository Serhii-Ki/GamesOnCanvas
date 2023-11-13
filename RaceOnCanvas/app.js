//Инициализация canvas tag и контекст для рисования
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//Создаем переменные контроля
const track = new Image(),
    myCar = new Image(),
    gameOver = new Image(),
    tree = new Image(),
    barrierGreen = new Image(),
    barrier = new Image();

//Назначение src для картинок
track.src = './assets/track.png';
myCar.src = './assets/car.png';
gameOver.src = './assets/game-over.jpg';
tree.src = './assets/tree.png';
barrierGreen.src = './assets/barrierGreen.png';
barrier.src = './assets/barrier.png';

//Позиции
let xCar = 290,
    yCar = canvas.height - 80,
    min = 90,
    max = 640,
    barrierGreenCar = [],
    barrierCar = [],
    trees = [];

barrierGreenCar[0] = {
    x: 450,
    y: 200
}

barrierCar[0] = {
    x: 300,
    y: 0
}

trees[0] = {
    x: 70,
    y: 30
}

//Переменные состояния
let score = 0;
let isArrowUpPressed = false;
let isArrowDownPressed = false;
let isArrowRightPressed = false;
let isArrowLeftPressed = false;
let isAlive = true;

//Событие нажатие на клавиатуре(любая)
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') {
        isArrowUpPressed = true;
    } else if (e.key === 'ArrowDown') {
        isArrowDownPressed = true;
    } else if (e.key === 'ArrowRight') {
        isArrowRightPressed = true;
    } else if (e.key === 'ArrowLeft') {
        isArrowLeftPressed = true;
    }
});

//Событие отжатия клавиши(любая)
document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowUp') {
        isArrowUpPressed = false;
    } else if (e.key === 'ArrowDown') {
        isArrowDownPressed = false;
    } else if (e.key === 'ArrowRight') {
        isArrowRightPressed = false;
    } else if (e.key === 'ArrowLeft') {
        isArrowLeftPressed = false;
    }
});


//Изменение положения машинки на canvas
function carControls() {
    if (isArrowUpPressed) {
        yCar -= 2;
    }
    if (isArrowDownPressed) {
        yCar += 2;
    }
    if (isArrowRightPressed) {
        xCar += 2;
    }
    if (isArrowLeftPressed) {
        xCar -= 2;
    }
}

function draw() {
    //Рисуем боковой фон
    ctx.fillStyle = 'grey';
    ctx.fillRect(50, 0, 100, canvas.height);
    ctx.fillRect(600, 0, 150, canvas.height);

    ctx.drawImage(track, 100, 0)//Рисуем Трек

    //Рисуем Преграды
    for (let i = 0; i < barrierCar.length; i++) {
        ctx.drawImage(barrier, barrierCar[i].x, barrierCar[i].y);
        barrierCar[i].y += 2;
        if (barrierCar[i].y == 300) {
            barrierCar.push({
                x: Math.floor(Math.random() * (max - min + 1)) + min,
                y: 0
            })
        }
        if ((xCar + 25 >= barrierCar[i].x
            && xCar + 25 <= barrierCar[i].x + barrier.width
            || xCar + myCar.width - 25 >= barrierCar[i].x
            && xCar + myCar.width - 25 <= barrierCar[i].x + barrier.width)
            && (yCar >= barrierCar[i].y
                && yCar <= barrierCar[i].y + barrier.height
                || yCar + myCar.height - 10 >= barrierCar[i].y
                && yCar + myCar.height - 10 <= barrierCar[i].y + barrier.height)
        ) {
            isAlive = false;
            setTimeout(() => ctx.drawImage(gameOver, 250, canvas.height / 2 - 200))
        }
        score += 0.1;
    }

    for (let i = 0; i < barrierGreenCar.length; i++) {
        ctx.drawImage(barrierGreen, barrierGreenCar[i].x, barrierGreenCar[i].y);
        barrierGreenCar[i].y += 2.5;
        if (barrierGreenCar[i].y == 300) {
            barrierGreenCar.push({
                x: Math.floor(Math.random() * (max - min + 1)) + min,
                y: 0
            })
        }
        if (((xCar + 25 >= barrierGreenCar[i].x
            && xCar + 25 <= barrierGreenCar[i].x + barrierGreen.width
            || xCar + myCar.width - 25 >= barrierGreenCar[i].x
            && xCar + myCar.width - 25 <= barrierGreenCar[i].x + barrierGreen.width)
            && (yCar >= barrierGreenCar[i].y
                && yCar <= barrierGreenCar[i].y + barrierGreen.height
                || yCar + myCar.height - 10 >= barrierGreenCar[i].y
                && yCar + myCar.height - 10 <= barrierGreenCar[i].y + barrierGreen.height))
            || xCar + 10 <= 100
            || xCar + myCar.width - 10 >= 100 + track.width
        ) {
            isAlive = false;
            setTimeout(() => ctx.drawImage(gameOver, 250, canvas.height / 2))
        }
    }

    //Рисуем Деревья 
    for (let i = 0; i < trees.length; i++) {
        ctx.drawImage(tree, trees[i].x, trees[i].y);
        ctx.drawImage(tree, trees[i].x + 590, trees[i].y);
        trees[i].y++;
        if (trees[i].y === 400) {
            trees.push({
                x: 70,
                y: 0
            })
        }
    }

    //Рисуем машинку
    ctx.drawImage(myCar, xCar, yCar);

    // //Отрисовка очков
    ctx.font = '20px mono';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score : ${Math.trunc(score)}`, 150, 15);

    if (isAlive) requestAnimationFrame(draw);

    carControls();
}

document.addEventListener('keydown', reloadGame)
function reloadGame(e) {
    if (e.keyCode === 32 && !isAlive) {
        location.reload();
    }
}
console.log(canvas.height);
barrier.onload = draw;