const dino = document.querySelector(".dino");
const background = document.querySelector(".background");
const gameScore = document.getElementById("game-score");
const gameBestScore = document.getElementById("game-best-score");
const gameOver = document.getElementById("game-over");
const infoContainer = document.getElementById("game-info");
const restartBtn = document.getElementById("restart-btn");

let isJumping = false;
let isGameOver = false;
let position = 0;
let score = 0;
let backgroundInterval = 1800;
let interval = 50;
let dinoInterval = 20;
let newCactus = null;
let g = 1;
const ls = localStorage.getItem("dino-high-score");

let bestScore = ls ? ls : 0;
let loop = null;

gameBestScore.innerHTML = "High Score: " + bestScore;

restartBtn.onclick = () => {
    if (isGameOver) {
        isGameOver = false;
        isJumping = false;
        position = 0;
        score = 0;
        interval = 50;
        backgroundInterval = 1800;
        background.style.animationDuration = backgroundInterval + "s";
        background.style.animationPlayState = "running";
        gameOver.classList.add("hidden");
        restartBtn.classList.add("hidden-btn");
        let cactusList = [...document.getElementsByClassName("cactus")];

        cactusList.forEach((cactus) => {
            cactus.remove();
        });

        loop = gameLoop();
    }
};

handleKeyDown = (event) => {
    if (event.keyCode === 32) {
        handleJump();
    }
};

handleTouchStart = () => {
    handleJump();
};

handleJump = () => {
    if (!isJumping && !isGameOver) jump();
};

jump = () => {
    isJumping = true;
    let vel = 20;
    let upInterval = setInterval(() => {
        vel -= g;
        if (position >= 140) {
            clearInterval(upInterval);

            let downInterval = setInterval(() => {
                position -= vel;
                dino.style.bottom = position + "px";
                if (position <= 4) {
                    clearInterval(downInterval);
                    isJumping = false;
                    position = 0;
                }
            }, interval);
        }
        position += vel;

        dino.style.bottom = position + "px";
    }, interval);
};

createCactus = () => {
    const cactus = document.createElement("div");
    let cactusPosition = 1000;
    let timeout = null;

    if (isGameOver) return;

    let randomTime = Math.random() * 6000;

    cactus.style.left = cactusPosition + "px";
    cactus.classList.add("cactus");
    background.appendChild(cactus);

    timeout = setTimeout(createCactus, randomTime);

    let leftInterval = setInterval(() => {
        cactusPosition -= 10;
        cactus.style.left = cactusPosition + "px";

        if (
            (cactusPosition > 0 && cactusPosition < 60 && position < 60) ||
            isGameOver
        ) {
            clearInterval(leftInterval);
            isGameOver = true;
            gameOver.classList.remove("hidden");
            restartBtn.classList.remove("hidden-btn");
            background.style.animationPlayState = "paused";
            clearInterval(loop);
            clearTimeout(timeout);
        }
        if (cactus && cactusPosition <= -60) {
            clearInterval(leftInterval);
            cactus.remove();
        }
    }, interval);
};

gameLoop = () => {
    createCactus();
    return setInterval(() => {
        score += 1;
        gameScore.innerHTML = "Score: " + score;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem("dino-high-score", bestScore);
            gameBestScore.innerHTML = "High Score: " + bestScore;
        }
        if (score % 50 === 0 && interval >= 5) {
            interval = interval - 1;
            backgroundInterval -= 30;
            background.style.animationDuration = backgroundInterval + "s";
        }
    }, 5 * interval);
};

loop = gameLoop();

document.addEventListener("keydown", handleKeyDown);
document.addEventListener("touchstart", handleTouchStart);