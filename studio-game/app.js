// ===== SCENE =====
function show(id) {
  document.querySelectorAll('.scene').forEach(s => s.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}

function backMenu() { show('menu'); }
function showHow() { show('how'); }
function showLeaderboard() {
  show('leaderboard');
  loadScores();
}

// ===== STATE =====
let score = 0;
let lives = 3;
let level = 1;
let time = 10;
let timer;
let correctWire;
let paused = false;

// ===== STATS =====
let stats = {
  games: 0,
  wins: 0
};

// ===== AUDIO =====
const tickSound = new Audio("sounds/tick.mp3");
const successSound = new Audio("sounds/success.mp3");
const failSound = new Audio("sounds/fail.mp3");

// ===== START =====
function startGame() {
  score = 0;
  lives = 3;
  level = 1;
  paused = false;

  stats.games++;

  show('game');
  nextRound();
}

// ===== ROUND =====
function nextRound() {
  const wires = ["red","blue","green","yellow"];
  correctWire = wires[Math.floor(Math.random()*wires.length)];

  time = Math.max(3, 10 - level);

  setStatus("🚨 Level " + level);
  updateUI();

  giveHint();
  runTimer();
}

// ===== TIMER =====
function runTimer() {
  clearInterval(timer);

  timer = setInterval(() => {
    if (paused) return;

    time--;
    updateUI();
    playTick();

    if (time <= 0) loseLife();
  }, 1000);
}

// ===== ACTION =====
function cutWire(color) {
  if (!correctWire || paused) return;

  clearInterval(timer);
  navigator.vibrate?.(100);

  if (color === correctWire) {
    playSuccess();

    score += 10;
    level++;

    setStatus("✅ Correct!");
    setTimeout(nextRound, 800);

  } else {
    playFail();
    shakeScreen();
    loseLife();
  }
}

// ===== LIFE =====
function loseLife() {
  lives--;

  if (lives <= 0) {
    gameOver();
  } else {
    setStatus("❌ Wrong! Lives: " + lives);
    setTimeout(nextRound, 800);
  }
}

// ===== GAME OVER =====
function gameOver() {
  setStatus("💀 GAME OVER | Score: " + score);
  saveScore(score);

  setTimeout(() => showLeaderboard(), 1200);
}

// ===== UI =====
function updateUI() {
  document.getElementById("score").innerText = score;
  document.getElementById("lives").innerText = lives;

  const timeEl = document.getElementById("time");
  timeEl.innerText = time;

  if (time <= 3) {
    timeEl.classList.add("danger");
  } else {
    timeEl.classList.remove("danger");
  }
}

function setStatus(msg) {
  document.getElementById("status").innerText = msg;
}

// ===== HINT =====
function giveHint() {
  const hints = [
    "🤖 AI analyzing...",
    "⚠ Signal unstable...",
    "📡 Checking safest path..."
  ];

  setTimeout(() => {
    setStatus(hints[Math.floor(Math.random()*hints.length)]);
  }, 1500);
}

// ===== EFFECT =====
function shakeScreen() {
  document.body.classList.add("shake");
  setTimeout(() => document.body.classList.remove("shake"), 200);
}

// ===== THEME =====
function toggleAlert() {
  document.body.classList.toggle("alert-mode");
}

// ===== KEYBOARD CONTROL =====
document.addEventListener("keydown", (e) => {
  if (e.key === "1") cutWire("red");
  if (e.key === "2") cutWire("blue");
  if (e.key === "3") cutWire("green");
  if (e.key === "4") cutWire("yellow");
});

// ===== LEADERBOARD =====
function saveScore(s) {
  let scores = JSON.parse(localStorage.getItem("scores") || "[]");

  scores.push(s);
  scores.sort((a,b)=>b-a);
  scores = scores.slice(0,5);

  localStorage.setItem("scores", JSON.stringify(scores));
}

function loadScores() {
  const box = document.getElementById("scores");
  box.innerHTML = "";

  let scores = JSON.parse(localStorage.getItem("scores") || "[]");

  if (scores.length === 0) {
    box.innerHTML = "<p>No scores yet</p>";
    return;
  }

  scores.forEach((s,i)=>{
    const div = document.createElement("div");
    div.textContent = `${i+1}. ${s}`;
    box.appendChild(div);
  });
}

// ===== AUDIO =====
function playTick() {
  try { tickSound.currentTime=0; tickSound.play(); } catch {}
}

function playSuccess() {
  try { successSound.play(); } catch {}
}

function playFail() {
  try { failSound.play(); } catch {}
}