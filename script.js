// Game constants
const TILE_SIZE = 16;
const MAP_WIDTH = 28;
const MAP_HEIGHT = 30; // Fixed: Matches mazeTemplate row count to prevent undefined errors
const CANVAS_WIDTH = MAP_WIDTH * TILE_SIZE;
const CANVAS_HEIGHT = MAP_HEIGHT * TILE_SIZE + 50; // Extra space for UI
const PACMAN_SPEED = 2;
const GHOST_SPEED = 1.5;
const POWER_TIME = 5000; // ms for power mode
const CHERRY_APPEAR_TIME = 10000; // ms until cherry appears
const CHERRY_DURATION = 10000; // ms cherry stays visible

// Maze layout (adjusted slightly to approximate Google logo shape with paths forming "G O O G L E"; walls=1, small pellet=2, power pellet=3, empty=0, ghost gate=5)
const mazeTemplate = [
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1],
  [1,0,0,0,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,0,0,0,1],
  [1,0,0,0,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,0,0,0,1],
  [1,0,0,0,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,0,0,0,1],
  [1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1,1,1,2,1,1,2,1,1,1,1,1,1],
  [1,5,5,5,5,5,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,5,5,5,5,5,1],
  [1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1],
  [1,0,0,0,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,0,0,0,1],
  [1,0,0,0,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,0,0,0,1],
  [1,0,0,0,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,0,0,0,1],
  [1,1,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,1,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,1,1,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,3,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,3,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,2,1,1,2,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,1,1,1,1,2,1,1,1,1,1,1,1,1,1,1,1,1,1,1,2,1,1,1,1,2,1],
  [1,2,2,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,1,1,2,2,2,2,2,2,1],
  [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
];

// Variables
let canvas, ctx;
let currentMaze = mazeTemplate.map(row => row.slice()); // Working copy of maze
let totalPellets = 0;
let pelletsEaten = 0;
let score = 0;
let level = 1;
let powerMode = false;
let powerTimer = 0;
let cherryActive = false;
let cherryX = 0;
let cherryY = 0;
let cherryTimer = Date.now() + CHERRY_APPEAR_TIME;

// Pacman
let pacman = {
  x: 13.5 * TILE_SIZE, // Starting position
  y: 23 * TILE_SIZE,
  dx: 0,
  dy: 0,
  intendedDx: 0,
  intendedDy: 0,
  direction: 'right',
  mouthOpen: true,
  frame: 0
};

// Ghosts colors
const ghostColors = ['red', 'blue', 'pink'];

// Ghosts
let ghosts = [
  { id: 1, x: 13 * TILE_SIZE, y: 11 * TILE_SIZE, dx: 0, dy: -GHOST_SPEED, direction: 'up', scared: false, eaten: false, released: false, releaseTime: 0 },
  { id: 2, x: 12 * TILE_SIZE, y: 14 * TILE_SIZE, dx: -GHOST_SPEED, dy: 0, direction: 'left', scared: false, eaten: false, released: false, releaseTime: 0 },
  { id: 3, x: 14 * TILE_SIZE, y: 14 * TILE_SIZE, dx: GHOST_SPEED, dy: 0, direction: 'right', scared: false, eaten: false, released: false, releaseTime: 0 }
];

// Count total pellets
for (let y = 0; y < MAP_HEIGHT; y++) {
  for (let x = 0; x < MAP_WIDTH; x++) {
    if (mazeTemplate[y][x] === 2 || mazeTemplate[y][x] === 3) totalPellets++;
  }
}

// Initialization
function init() {
  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = CANVAS_WIDTH;
  canvas.height = CANVAS_HEIGHT;
  document.addEventListener('keydown', handleKeyDown);
  resetLevel();
  requestAnimationFrame(gameLoop);
}

// Key handling
function handleKeyDown(e) {
  switch (e.keyCode) {
    case 37: pacman.intendedDx = -PACMAN_SPEED; pacman.intendedDy = 0; pacman.direction = 'left'; break;
    case 38: pacman.intendedDx = 0; pacman.intendedDy = -PACMAN_SPEED; pacman.direction = 'up'; break;
    case 39: pacman.intendedDx = PACMAN_SPEED; pacman.intendedDy = 0; pacman.direction = 'right'; break;
    case 40: pacman.intendedDx = 0; pacman.intendedDy = PACMAN_SPEED; pacman.direction = 'down'; break;
  }
}

// Can move function
function canMove(x, y, dx, dy) {
  const newX = x + dx;
  const newY = y + dy;
  const tileX1 = Math.floor(newX / TILE_SIZE);
  const tileY1 = Math.floor(newY / TILE_SIZE);
  const tileX2 = Math.floor((newX + TILE_SIZE - 1) / TILE_SIZE);
  const tileY2 = Math.floor((newY + TILE_SIZE - 1) / TILE_SIZE);

  if (tileX1 < 0 || tileX2 >= MAP_WIDTH || tileY1 < 0 || tileY2 >= MAP_HEIGHT) return true; // Tunnels

  return !(currentMaze[tileY1][tileX1] === 1 || currentMaze[tileY1][tileX2] === 1 ||
    currentMaze[tileY2][tileX1] === 1 || currentMaze[tileY2][tileX2] === 1);
}

// Get reverse direction
function getReverse(dir) {
  if (dir === 'left') return 'right';
  if (dir === 'right') return 'left';
  if (dir === 'up') return 'down';
  if (dir === 'down') return 'up';
}

// Update game state
function update() {
  // Update Pacman direction if possible
  if (canMove(pacman.x, pacman.y, pacman.intendedDx, pacman.intendedDy)) {
    pacman.dx = pacman.intendedDx;
    pacman.dy = pacman.intendedDy;
  }

  // Move Pacman if possible
  if (canMove(pacman.x, pacman.y, pacman.dx, pacman.dy) ) {
    pacman.x += pacman.dx;
    pacman.y += pacman.dy;
  } else {
    pacman.dx = 0;
    pacman.dy = 0;
  }

  // Tunnel wrap-around
  if (pacman.x < -TILE_SIZE) pacman.x = CANVAS_WIDTH;
  if (pacman.x > CANVAS_WIDTH) pacman.x = -TILE_SIZE;

  // Eat pellets
  const tileX = Math.floor(pacman.x / TILE_SIZE);
  const tileY = Math.floor(pacman.y / TILE_SIZE);
  if (tileY >= 0 && tileY < MAP_HEIGHT && tileX >= 0 && tileX < MAP_WIDTH) { // Added bounds check
    if (currentMaze[tileY][tileX] === 2) {
      currentMaze[tileY][tileX] = 0;
      score += 10;
      pelletsEaten++;
    } else if (currentMaze[tileY][tileX] === 3) {
      currentMaze[tileY][tileX] = 0;
      score += 50;
      pelletsEaten++;
      powerMode = true;
      powerTimer = Date.now() + POWER_TIME;
      ghosts.forEach(g => g.scared = true);
    }
  }

  // End power mode
  if (powerMode && Date.now() > powerTimer) {
    powerMode = false;
    ghosts.forEach(g => g.scared = false);
  }

  // Update ghosts
  ghosts.forEach((ghost, index) => {
    if (ghost.eaten) {
      ghost.x = 13 * TILE_SIZE;
      ghost.y = 14 * TILE_SIZE;
      ghost.scared = false;
      ghost.eaten = false;
      ghost.dx = 0;
      ghost.dy = -GHOST_SPEED;
      ghost.direction = 'up';
      ghost.released = false;
      ghost.releaseTime = Date.now() + 5000;
    }

    // Check release
    if (!ghost.released) {
      if (Date.now() > ghost.releaseTime) {
        ghost.released = true;
      } else {
        ghost.dx = 0;
        ghost.dy = 0;
        return;
      }
    }

    // Possible directions
    const possibleDirs = [];
    if (canMove(ghost.x, ghost.y, GHOST_SPEED, 0)) possibleDirs.push('right');
    if (canMove(ghost.x, ghost.y, -GHOST_SPEED, 0)) possibleDirs.push('left');
    if (canMove(ghost.x, ghost.y, 0, -GHOST_SPEED)) possibleDirs.push('up');
    if (canMove(ghost.x, ghost.y, 0, GHOST_SPEED)) possibleDirs.push('down');

    // Avoid reverse
    const reverse = getReverse(ghost.direction);
    if (possibleDirs.length > 1) possibleDirs = possibleDirs.filter(d => d !== reverse);

    // Choose direction
    let newDir;
    if (index === 0 && !ghost.scared) {
      const dx = pacman.x - ghost.x;
      const dy = pacman.y - ghost.y;
      if (Math.abs(dx) > Math.abs(dy)) {
        newDir = dx > 0 ? 'right' : 'left';
      } else {
        newDir = dy > 0 ? 'down' : 'up';
      }
      if (!possibleDirs.includes(newDir)) newDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
    } else {
      newDir = possibleDirs[Math.floor(Math.random() * possibleDirs.length)];
    }

    // Set direction
    switch (newDir) {
      case 'left': ghost.dx = -GHOST_SPEED; ghost.dy = 0; ghost.direction = 'left'; break;
      case 'right': ghost.dx = GHOST_SPEED; ghost.dy = 0; ghost.direction = 'right'; break;
      case 'up': ghost.dx = 0; ghost.dy = -GHOST_SPEED; ghost.direction = 'up'; break;
      case 'down': ghost.dx = 0; ghost.dy = GHOST_SPEED; ghost.direction = 'down'; break;
    }

    ghost.x += ghost.dx;
    ghost.y += ghost.dy;

    // Tunnel wrap-around
    if (ghost.x < -TILE_SIZE) ghost.x = CANVAS_WIDTH;
    if (ghost.x > CANVAS_WIDTH) ghost.x = -TILE_SIZE;
  });

  // Ghost collisions with Pacman
  ghosts.forEach(ghost => {
    if (Math.abs(ghost.x - pacman.x) < TILE_SIZE && Math.abs(ghost.y - pacman.y) < TILE_SIZE) {
      if (powerMode && !ghost.eaten) {
        ghost.eaten = true;
        score += 200;
      } else if (!powerMode) {
        alert('Game Over!');
        resetGame();
      }
    }
  });

  // Bonus cherry
  if (!cherryActive && Date.now() > cherryTimer) {
    let x, y;
    do {
      x = Math.floor(Math.random() * MAP_WIDTH);
      y = Math.floor(Math.random() * MAP_HEIGHT);
    } while (currentMaze[y][x] === 1);
    cherryX = x * TILE_SIZE;
    cherryY = y * TILE_SIZE;
    cherryActive = true;
    cherryTimer = Date.now() + CHERRY_DURATION;
  }
  if (cherryActive && Date.now() > cherryTimer) {
    cherryActive = false;
    cherryTimer = Date.now() + CHERRY_APPEAR_TIME;
  }
  if (cherryActive && Math.abs(cherryX - pacman.x) < TILE_SIZE && Math.abs(cherryY - pacman.y) < TILE_SIZE) {
    score += 100;
    cherryActive = false;
    cherryTimer = Date.now() + CHERRY_APPEAR_TIME;
  }

  // Level complete
  if (pelletsEaten === totalPellets) {
    level++;
    if (level > 10) {
      level = 1;
      score = 0;
    }
    resetLevel();
  }

  // Chomping animation
  pacman.frame++;
  if (pacman.frame % 5 === 0) pacman.mouthOpen = !pacman.mouthOpen;
}

// Draw Pacman (fixed angles for proper rendering in all directions)
function drawPacman(x, y, direction, mouthOpen) {
  ctx.fillStyle = 'yellow';
  ctx.beginPath();
  const centerX = x + TILE_SIZE / 2;
  const centerY = y + TILE_SIZE / 2;
  const radius = TILE_SIZE / 2;
  let startAngle = 0;
  let endAngle = 2 * Math.PI;
  const mouthAngle = mouthOpen ? Math.PI / 4 : 0; // 45 degrees for open mouth

  switch (direction) {
    case 'right':
      startAngle = mouthOpen ? mouthAngle : 0;
      endAngle = mouthOpen ? 2 * Math.PI - mouthAngle : 2 * Math.PI;
      break;
    case 'left':
      startAngle = mouthOpen ? Math.PI + mouthAngle : Math.PI;
      endAngle = mouthOpen ? Math.PI - mouthAngle : Math.PI + 2 * Math.PI; // Wrap around
      break;
    case 'up':
      startAngle = mouthOpen ? (3 * Math.PI / 2) + mouthAngle : 3 * Math.PI / 2;
      endAngle = mouthOpen ? (3 * Math.PI / 2) - mouthAngle + 2 * Math.PI : 3 * Math.PI / 2 + 2 * Math.PI;
      break;
    case 'down':
      startAngle = mouthOpen ? (Math.PI / 2) + mouthAngle : Math.PI / 2;
      endAngle = mouthOpen ? (Math.PI / 2) - mouthAngle + 2 * Math.PI : Math.PI / 2 + 2 * Math.PI;
      break;
  }

  ctx.arc(centerX, centerY, radius, startAngle, endAngle);
  ctx.lineTo(centerX, centerY);
  ctx.fill();
}

// Draw Ghost
function drawGhost(x, y, direction, scared, stationary, color) {
  if (scared) color = 'blue';
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, TILE_SIZE / 2, Math.PI, 0, false);
  ctx.lineTo(x + TILE_SIZE, y + TILE_SIZE);
  ctx.lineTo(x + (3 * TILE_SIZE / 4), y + TILE_SIZE - TILE_SIZE / 4);
  ctx.lineTo(x + TILE_SIZE / 2, y + TILE_SIZE);
  ctx.lineTo(x + TILE_SIZE / 4, y + TILE_SIZE - TILE_SIZE / 4);
  ctx.lineTo(x, y + TILE_SIZE);
  ctx.lineTo(x, y + TILE_SIZE / 2);
  ctx.closePath();
  ctx.fill();

  // Eyes
  ctx.fillStyle = 'white';
  ctx.beginPath();
  let eyeX1 = x + TILE_SIZE / 4;
  let eyeX2 = x + 3 * TILE_SIZE / 4;
  let eyeY = y + TILE_SIZE / 2;
  let pupilOffsetX = 0, pupilOffsetY = 0;
  if (!stationary && !scared) {
    switch (direction) {
      case 'right': pupilOffsetX = TILE_SIZE / 8; break;
      case 'left': pupilOffsetX = -TILE_SIZE / 8; break;
      case 'up': pupilOffsetY = -TILE_SIZE / 8; break;
      case 'down': pupilOffsetY = TILE_SIZE / 8; break;
    }
  } // For stationary, eyes forward (no offset)

  ctx.arc(eyeX1, eyeY, TILE_SIZE / 8, 0, Math.PI * 2);
  ctx.arc(eyeX2, eyeY, TILE_SIZE / 8, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = 'black';
  ctx.beginPath();
  ctx.arc(eyeX1 + pupilOffsetX, eyeY + pupilOffsetY, TILE_SIZE / 16, 0, Math.PI * 2);
  ctx.arc(eyeX2 + pupilOffsetX, eyeY + pupilOffsetY, TILE_SIZE / 16, 0, Math.PI * 2);
  ctx.fill();

  if (scared) {
    // Wavy mouth
    ctx.strokeStyle = 'white';
    ctx.lineWidth = TILE_SIZE / 8;
    ctx.beginPath();
    ctx.moveTo(x + TILE_SIZE / 4, y + 3 * TILE_SIZE / 4);
    ctx.quadraticCurveTo(x + TILE_SIZE / 2, y + TILE_SIZE / 4 + TILE_SIZE / 2, x + 3 * TILE_SIZE / 4, y + 3 * TILE_SIZE / 4);
    ctx.stroke();
  }
}

// Draw Pellet
function drawPellet(x, y, large) {
  ctx.fillStyle = 'white';
  ctx.beginPath();
  ctx.arc(x + TILE_SIZE / 2, y + TILE_SIZE / 2, large ? TILE_SIZE / 4 : TILE_SIZE / 8, 0, Math.PI * 2);
  ctx.fill();
}

// Draw Cherry
function drawCherry(x, y) {
  ctx.fillStyle = 'red';
  ctx.beginPath();
  ctx.arc(x + TILE_SIZE / 3, y + 2 * TILE_SIZE / 3, TILE_SIZE / 4, 0, Math.PI * 2);
  ctx.arc(x + 2 * TILE_SIZE / 3, y + TILE_SIZE / 3, TILE_SIZE / 4, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = 'green';
  ctx.lineWidth = TILE_SIZE / 8;
  ctx.beginPath();
  ctx.moveTo(x + TILE_SIZE / 2, y + TILE_SIZE / 4);
  ctx.lineTo(x + TILE_SIZE / 3, y + TILE_SIZE / 2);
  ctx.moveTo(x + TILE_SIZE / 2, y + TILE_SIZE / 4);
  ctx.lineTo(x + 2 * TILE_SIZE / 3, y + TILE_SIZE / 2);
  ctx.stroke();
}

// Draw game
function draw() {
  ctx.fillStyle = 'black';
  ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

  // Draw maze walls and pellets
  for (let y = 0; y < MAP_HEIGHT; y++) {
    for (let x = 0; x < MAP_WIDTH; x++) {
      if (currentMaze[y][x] === 1) {
        ctx.fillStyle = 'blue';
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
      } else if (currentMaze[y][x] === 2) {
        drawPellet(x * TILE_SIZE, y * TILE_SIZE, false);
      } else if (currentMaze[y][x] === 3) {
        drawPellet(x * TILE_SIZE, y * TILE_SIZE, true);
      } else if (currentMaze[y][x] === 5) {
        ctx.fillStyle = 'pink';
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE, 2);
      }
    }
  }

  // Draw Pacman
  drawPacman(pacman.x, pacman.y, pacman.direction, pacman.mouthOpen);

  // Draw ghosts
  ghosts.forEach(ghost => {
    const stationary = ghost.dx === 0 && ghost.dy === 0;
    drawGhost(ghost.x, ghost.y, ghost.direction, ghost.scared, stationary, ghostColors[ghost.id - 1]);
  });

  // Draw cherry
  if (cherryActive) {
    drawCherry(cherryX, cherryY);
  }

  // Draw UI
  ctx.fillStyle = 'white';
  ctx.font = 'bold 20px Arial';
  ctx.fillText(`Score: ${score}`, 10, CANVAS_HEIGHT - 20);
  ctx.fillText(`Level: ${level}`, CANVAS_WIDTH - 100, CANVAS_HEIGHT - 20);
}

// Game loop
function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

// Reset level
function resetLevel() {
  const delays = [0, 3000, 6000];
  pelletsEaten = 0;
  currentMaze = mazeTemplate.map(row => row.slice());
  pacman.x = 13.5 * TILE_SIZE;
  pacman.y = 23 * TILE_SIZE;
  pacman.dx = 0;
  pacman.dy = 0;
  pacman.intendedDx = 0;
  pacman.intendedDy = 0;
  pacman.direction = 'right';
  ghosts[0].x = 13 * TILE_SIZE; ghosts[0].y = 11 * TILE_SIZE; ghosts[0].dx = 0; ghosts[0].dy = -GHOST_SPEED; ghosts[0].direction = 'up';
  ghosts[1].x = 12 * TILE_SIZE; ghosts[1].y = 14 * TILE_SIZE; ghosts[1].dx = -GHOST_SPEED; ghosts[1].dy = 0; ghosts[1].direction = 'left';
  ghosts[2].x = 14 * TILE_SIZE; ghosts[2].y = 14 * TILE_SIZE; ghosts[2].dx = GHOST_SPEED; ghosts[2].dy = 0; ghosts[2].direction = 'right';
  ghosts.forEach((g, i) => { 
    g.scared = false; 
    g.eaten = false; 
    g.released = false;
    g.releaseTime = Date.now() + delays[i];
  });
  powerMode = false;
  cherryActive = false;
  cherryTimer = Date.now() + CHERRY_APPEAR_TIME;
}

// Reset full game
function resetGame() {
  score = 0;
  level = 1;
  resetLevel();
}

window.onload = init;
