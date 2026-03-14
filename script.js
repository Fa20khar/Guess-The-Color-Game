const colorCode = document.getElementById("color-code");
const optionContainer = document.getElementById("option-container");
const scoreContainer = document.getElementById("score");
const levelContainer = document.getElementById("level");
const highScoreContainer = document.getElementById("high-score");
const message = document.getElementById("message");
const restartBtn = document.getElementById("restart");
const timerBar = document.getElementById("timer-bar");
const winScreen = document.getElementById("win-screen");
const winRestartBtn = document.getElementById("win-restart");
const confettiCanvas = document.getElementById("confetti");
const confettiCtx = confettiCanvas.getContext("2d");

let randomColor;
let score = 0;
let level = 1;
let highScore = localStorage.getItem("highScore") || 0;
let timerInterval;
let timePerLevel = 10; // seconds

highScoreContainer.innerText = highScore;

// Generate random number
function randomNumber(min,max){
    return min + Math.floor(Math.random()*(max-min+1));
}

// Random RGB color
function randomColorRGB(){
    const r = randomNumber(0,255);
    const g = randomNumber(0,255);
    const b = randomNumber(0,255);
    return `rgb(${r}, ${g}, ${b})`;
}

// Options per level
function getOptionsByLevel(){
    if(level <=3) return 4;
    if(level <=6) return 6;
    if(level <=8) return 8;
    return 10;
}

// Timer bar
function startTimer(){
    clearInterval(timerInterval);
    let timeLeft = timePerLevel;
    timerBar.style.width="100%";

    timerInterval = setInterval(()=>{
        timeLeft -= 0.1;
        timerBar.style.width = (timeLeft/timePerLevel*100)+"%";
        if(timeLeft <= 0){
            clearInterval(timerInterval);
            message.innerText="⏰ Time's Up!";
            message.style.color="red";
            score=0;
            level=1;
            scoreContainer.innerText=score;
            setTimeout(startGame,1000);
        }
    },100);
}

// Start level
function startGame(){
    optionContainer.innerHTML="";
    message.innerText="";
    levelContainer.innerText = level;

    randomColor = randomColorRGB();
    colorCode.innerText = randomColor;

    const options = getOptionsByLevel();
    const correctIndex = randomNumber(0, options-1);

    for(let i=0;i<options;i++){
        const box = document.createElement("div");
        box.innerText = `Option ${i+1}`;
        box.style.backgroundColor = i===correctIndex?randomColor:randomColorRGB();
        box.addEventListener("click",checkAnswer);
        optionContainer.appendChild(box);
    }

    startTimer();
}

// Answer check
function checkAnswer(e){
    clearInterval(timerInterval);
    const selectedColor = e.target.style.backgroundColor;

    if(selectedColor === randomColor){
        message.innerText="✅ Correct!";
        message.style.color="lightgreen";
        score++;
        level++;
        if(level>10){
            showWinScreen();
            return;
        }
    }else{
        message.innerText="❌ Wrong!";
        message.style.color="red";
        score=0;
        level=1;
    }

    scoreContainer.innerText = score;

    if(score>highScore){
        highScore = score;
        localStorage.setItem("highScore",highScore);
        highScoreContainer.innerText = highScore;
    }

    setTimeout(startGame,1000);
}

// Win screen with confetti
function showWinScreen(){
    winScreen.style.display="flex";
    startConfetti();
}

// Restart from win
winRestartBtn.addEventListener("click",()=>{
    winScreen.style.display="none";
    stopConfetti();
    score=0;
    level=1;
    scoreContainer.innerText=score;
    startGame();
});

// Restart button
restartBtn.addEventListener("click",()=>{
    score=0;
    level=1;
    scoreContainer.innerText=score;
    startGame();
});

window.addEventListener("load",startGame);

// ===== Confetti animation =====
let confettiParticles = [];
function startConfetti(){
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
    confettiParticles = [];
    for(let i=0;i<200;i++){
        confettiParticles.push({
            x:Math.random()*confettiCanvas.width,
            y:Math.random()*confettiCanvas.height,
            r:Math.random()*6+4,
            d:Math.random()*200,
            color:`hsl(${Math.random()*360},100%,50%)`,
            tilt:Math.random()*10-10,
            tiltAngleIncremental:Math.random()*0.07+0.05,
            tiltAngle:0
        });
    }
    drawConfetti();
}

let confettiAnimation;
function drawConfetti(){
    confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
    for(let i=0;i<confettiParticles.length;i++){
        let p = confettiParticles[i];
        confettiCtx.beginPath();
        confettiCtx.lineWidth = p.r;
        confettiCtx.strokeStyle = p.color;
        confettiCtx.moveTo(p.x + p.tilt + p.r/2, p.y);
        confettiCtx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r/2);
        confettiCtx.stroke();
    }
    updateConfetti();
    confettiAnimation = requestAnimationFrame(drawConfetti);
}

function updateConfetti(){
    for(let i=0;i<confettiParticles.length;i++){
        let p = confettiParticles[i];
        p.tiltAngle += p.tiltAngleIncremental;
        p.y += (Math.cos(p.d)+3+p.r/2)/2;
        p.x += Math.sin(p.d);
        p.tilt = Math.sin(p.tiltAngle)*15;
        if(p.y>confettiCanvas.height){
            p.y = -10;
            p.x = Math.random()*confettiCanvas.width;
        }
    }
}

function stopConfetti(){
    cancelAnimationFrame(confettiAnimation);
    confettiCtx.clearRect(0,0,confettiCanvas.width,confettiCanvas.height);
}