//Инициализация canvas tag и контекст для рисования
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//Создаем переменные контроля
let bird = new Image();
let bg = new Image();
let fg = new Image();
let pipeUp = new Image();
let pipeBottom = new Image();
let heart = new Image();
let gameOver = new Image();

//Назначение src для картинок
bird.src = './assets/flappy_bird_bird.png';
bg.src = './assets/flappy_bird_bg.png';
fg.src = './assets/flappy_bird_fg.png';
pipeUp.src = './assets/flappy_bird_pipeUp.png';
pipeBottom.src = './assets/flappy_bird_pipeBottom.png';
heart.src = './assets/heart.png';
gameOver.src = './assets/game-over.png';

//Создаем переменные аудио
let sounds = true;
let fly = new Audio();
let scoreAudio = new Audio();

//Назначение src для аудио
fly.src = './assets/fly.mp3';
scoreAudio.src = './assets/score.mp3';

//Позиции
let xPos = 10;
let yPos = 150;
let gap = 80;
let grav = 0.5;
let pipes = [];
let lifeCount = 3;
let score = 0;
let revel = false;
let revelTime = 3000;

pipes[0] = {
    x: canvas.width,
    y: 0
};

//Переменные состояния
let isArrowUpPressed = false;
let isArrowDownPressed = false;
let isAlive = true;

//Событие нажатие на клавиатуре(любая)
document.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowUp') {
        isArrowUpPressed = true;
    } else if (e.key === 'ArrowDown') {
        isArrowDownPressed = true;
    }
});

//Событие отжатия клавиши(любая)
document.addEventListener('keyup', function (e) {
    if (e.key === 'ArrowUp') {
        isArrowUpPressed = false;
    } else if (e.key === 'ArrowDown') {
        isArrowDownPressed = false;
    }
});


//Изменение положения птицы на canvas
function birdFly() {
    if (isArrowUpPressed) {
        yPos -= 1.5;
        if (sounds) fly.play();
    }
    if (isArrowDownPressed) {
        yPos++;
        if (sounds) fly.play();
    }
}

//Проверка столкновения птицы с преградой и удаление жизней
function checkCollision() {
    for (let i = 0; i < pipes.length; i++) {
        // Получаем координаты преграды (верхней и нижней) и птицы
        const pipeUpX = pipes[i].x;
        const pipeUpY = pipes[i].y;
        const pipeBottomX = pipes[i].x;
        const pipeBottomY = pipes[i].y + pipeUp.height + gap;
        const birdX = xPos;
        const birdY = yPos;

        // Проверяем столкновение с верхней преградой
        if (
            birdX + bird.width >= pipeUpX + 5 &&
            birdX <= pipeUpX + pipeUp.width - 5 &&
            birdY <= pipeUpY + pipeUp.height - 5
        ) {
            //Уменьшаем жизни
            lifeCount--;
            isAlive = false; //Bird is dead
        }

        // Проверяем столкновение с нижней преградой
        if (
            birdX + bird.width >= pipeBottomX + 5 &&
            birdX <= pipeBottomX + pipeBottom.width - 5 &&
            birdY + bird.height >= pipeBottomY + 5 || birdY > canvas.height - fg.height - 25
        ) {
            //Уменьшаем жизни
            lifeCount--;
            isAlive = false; //Bird is dead
        }
    }
}

//Отрисовка canvas
function draw() {
    ctx.drawImage(bg, 0, 0);//Рисуем задний фон
    //Циклично отрисовуем приграда 1-я верхняя и 2-я нижняя
    for (let i = 0; i < pipes.length; i++) {
        ctx.drawImage(pipeUp, pipes[i].x, pipes[i].y);//1-я верхняя преграда
        ctx.drawImage(pipeBottom, pipes[i].x, pipes[i].y + pipeUp.height + gap);//2-я нижняя преграда
        pipes[i].x--;//изменение позиции x
        if (pipes[i].x === 125) {
            pipes.push({
                x: canvas.width + 150,
                y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height
            })
            if (sounds) {
                scoreAudio.play();
            }
        }
        //Код с урока
        if (xPos + bird.width >= pipes[i].x
            && xPos <= pipes[i].x + pipeUp.width
            && (yPos <= pipes[i].y + pipeUp.height
                || yPos + bird.height > pipes[i].y + pipeUp.height + gap)
            || yPos + bird.height > canvas.height - fg.height
        ) {
            birdRevel();
        }

        score += 0.02;
    }
    if (lifeCount > 0) ctx.drawImage(bird, xPos, yPos);//рисуем птицу

    ctx.drawImage(fg, 0, canvas.height - fg.height);//рисуем передний фон

    //Проверяем условие и отрисовываем сердца
    // if (lifeCount >= 1) ctx.drawImage(heart, -10, -10);//рисуем первое сердце
    // if (lifeCount >= 2) ctx.drawImage(heart, 20, -10);//рисуем второе сердце
    // if (lifeCount === 3) ctx.drawImage(heart, 50, -10);//рисуем третье сердце   

    //Отрисовка очков
    ctx.font = '18px mono';
    ctx.fillStyle = 'white';
    ctx.fillText(`Score : ${Math.trunc(score)}`, 200, 15);

    //Имитация гравитации птицы
    yPos = yPos + grav;

    checkLives();

    //Проверяем 
    if (lifeCount > 0) {
        requestAnimationFrame(draw);//Ф-ция отрабатывает каждый раз когда в canvase что либо меняется
    }

    birdFly();
    // checkCollision();
}

//Проверка кол-ва жизней
function checkLives() {
    let xHeart = 0;
    for (let i = 1; i <= lifeCount; i++) {
        ctx.drawImage(heart, -10 + xHeart, -10);
        xHeart += 30;
    }
}

//Воскрешение птицы после проигрыша
function birdRevel() {
    if (!revel) {
        revel = true;
        lifeCount--;

        if (lifeCount === 0) {
            setTimeout(() => ctx.drawImage(gameOver, 100, 175));
        }

        setTimeout(() => revel = false, revelTime);
    }
}

document.addEventListener('keydown', reloadGame)
function reloadGame(e) {
    if (e.keyCode === 32 && lifeCount === 0) {
        location.reload();
    }
}

//pipeBottom - это последний слой который отрисовывается
pipeBottom.onload = draw;