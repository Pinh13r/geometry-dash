// Geometry Dash Full Gameplay Code (Steps 1–10)

const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ========== GAME STATE ========== //
let isPaused = false;
let isMuted = false;
let score = 0;
let gravityFlipped = false;
let currentLevel = 0;
let levels = [];

const player = {
  x: 100,
  y: 400,
  width: 40,
  height: 40,
  color: 'cyan',
  velocityY: 0,
  gravity: 0.8,
  jumpPower: -15,
  grounded: false
};

const obstacles = [];
const powerUps = [];

const bgLayers = [
  { speed: 0.2, color: '#222' },
  { speed: 0.5, color: '#444' }
];

let music = new Audio('music.mp3');
music.loop = true;

function spawnObstacle(x, width, height) {
  obstacles.push({ x, width, height, y: canvas.height - 100 - height });
}

function spawnPowerUp(x, type) {
  powerUps.push({ x, y: canvas.height - 160, width: 30, height: 30, type });
}

function update() {
  if (isPaused) return;

  // Music sync logic can go here (e.g., syncing obstacle spawn)

  // Gravity
  player.velocityY += gravityFlipped ? -player.gravity : player.gravity;
  player.y += player.velocityY;

  // Ground or ceiling collision
  if (!gravityFlipped && player.y + player.height > canvas.height - 100) {
    player.y = canvas.height - 100 - player.height;
    player.velocityY = 0;
    player.grounded = true;
  } else if (gravityFlipped && player.y < 0) {
    player.y = 0;
    player.velocityY = 0;
    player.grounded = true;
  } else {
    player.grounded = false;
  }

  // Move obstacles and power-ups
  for (let obs of obstacles) {
    obs.x -= 6;
    if (
      player.x < obs.x + obs.width &&
      player.x + player.width > obs.x &&
      player.y < obs.y + obs.height &&
      player.y + player.height > obs.y
    ) {
      resetProgress();
    }
  }

  for (let p of powerUps) {
    p.x -= 6;
    if (
      player.x < p.x + p.width &&
      player.x + player.width > p.x &&
      player.y < p.y + p.height &&
      player.y + player.height > p.y
    ) {
      activatePowerUp(p.type);
    }
  }

  // Score
  score++;
}

function drawBackground() {
  for (let layer of bgLayers) {
    ctx.fillStyle = layer.color;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBackground();

  // Draw floor
  ctx.fillStyle = '#333';
  ctx.fillRect(0, canvas.height - 100, canvas.width, 100);

  // Draw player
  ctx.fillStyle = player.color;
  ctx.fillRect(player.x, player.y, player.width, player.height);

  // Draw obstacles
  ctx.fillStyle = 'red';
  for (let obs of obstacles) {
    ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
  }

  // Draw power-ups
  ctx.fillStyle = 'gold';
  for (let p of powerUps) {
    ctx.fillRect(p.x, p.y, p.width, p.height);
  }

  // Score
  ctx.fillStyle = 'white';
  ctx.font = '20px sans-serif';
  ctx.fillText(`Score: ${score}`, 20, 30);
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function activatePowerUp(type) {
  if (type === 'flip') {
    gravityFlipped = !gravityFlipped;
  }
  // Add more power-ups as needed
}

function resetProgress() {
  localStorage.removeItem('gd_save');
  location.reload();
}

function saveProgress() {
  localStorage.setItem('gd_save', JSON.stringify({ score }));
}

function showLeaderboard() {
  alert('🏆 Leaderboard coming soon!');
}

// Controls

function jump() {
  if (player.grounded) {
    player.velocityY = gravityFlipped ? -player.jumpPower : player.jumpPower;
  }
}

document.addEventListener('keydown', e => {
  if (e.code === 'Space') jump();
});

document.getElementById('jumpButton').addEventListener('click', jump);
document.getElementById('pauseButton').addEventListener('click', () => {
  isPaused = !isPaused;
});
document.getElementById('muteButton').addEventListener('click', () => {
  isMuted = !isMuted;
  music.volume = isMuted ? 0 : 1;
});
document.getElementById('resetButton').addEventListener('click', resetProgress);

// Start game
music.play();
gameLoop();