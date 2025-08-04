// Game constants
const TILE_SIZE = 16;
const MAP_WIDTH = 28;
const MAP_HEIGHT = 31;
const CANVAS_WIDTH = MAP_WIDTH * TILE_SIZE;
const CANVAS_HEIGHT = MAP_HEIGHT * TILE_SIZE + 50; // Extra space for UI
const PACMAN_SPEED = 2;
const GHOST_SPEED = 1.5;
const POWER_TIME = 5000; // ms for power mode
const CHERRY_APPEAR_TIME = 10000; // ms until cherry appears
const CHERRY_DURATION = 10000; // ms cherry stays visible

// Maze layout (inspired by classic Pacman, shaped with paths and walls; 1 = wall, 2 = small pellet, 3 = power pellet, 0 = empty path, 5 = ghost house gate)
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
let images = {};

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

// Ghosts
let ghosts = [
  { id: 1, x: 13 * TILE_SIZE, y: 11 * TILE_SIZE, dx: 0, dy: -GHOST_SPEED, direction: 'up', scared: false, eaten: false, released: false, releaseTime: 0 },
  { id: 2, x: 12 * TILE_SIZE, y: 14 * TILE_SIZE, dx: -GHOST_SPEED, dy: 0, direction: 'left', scared: false, eaten: false, released: false, releaseTime: 0 },
  { id: 3, x: 14 * TILE_SIZE, y: 14 * TILE_SIZE, dx: GHOST_SPEED, dy: 0, direction: 'right', scared: false, eaten: false, released: false, releaseTime: 0 }
];

// Load images
const imageFiles = [
  'pacman_right_open', 'pacman_right_closed',
  'pacman_left_open', 'pacman_left_closed',
  'pacman_up_open', 'pacman_up_closed',
  'pacman_down_open', 'pacman_down_closed',
  'ghost1_left', 'ghost1_right', 'ghost1_up', 'ghost1_down', 'ghost1_scared', 'ghost1_normal',
  'ghost2_left', 'ghost2_right', 'ghost2_up', 'ghost2_down', 'ghost2_scared', 'ghost2_normal',
  'ghost3_left', 'ghost3_right', 'ghost3_up', 'ghost3_down', 'ghost3_scared', 'ghost3_normal',
  'pellet_small', 'pellet_large', 'cherry'
];

function loadImages() {
  let loaded = 0;
  imageFiles.forEach(file => {
    images[file] = new Image();
    images[file].src = `images/${file}.png`;
    images[file].onload = () => {
      loaded++;
      if (loaded === imageFiles.length) {
        resetLevel();
        requestAnimationFrame(gameLoop);
      }
    };
  });
}

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
  loadImages();
  document.addEventListener('keydown', handleKeyDown);
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

// Check if move is possible
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
  if (canMove(pacman.x, pacman.y, pacman.dx, pacman.dy)) {
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

  // End power mode
  if (powerMode && Date.now() > powerTimer) {
    powerMode = false;
    ghosts.forEach(g => g.scared = false);
  }

  // Update ghosts (simple random movement with basic pursuit for one ghost)
  ghosts.forEach((ghost, index) => {
    if (ghost.eaten) {
      // Reset to ghost house
      ghost.x = 13 * TILE_SIZE;
      ghost.y = 14 * TILE_SIZE;
      ghost.scared = false;
      ghost.eaten = false;
      ghost.dx = 0;
      ghost.dy = -GHOST_SPEED;
      ghost.direction = 'up';
      ghost.released = false;
      ghost.releaseTime = Date.now() + 5000; // Delay re-release after eaten
    }

    // Check release
    if (!ghost.released) {
      if (Date.now() > ghost.releaseTime) {
        ghost.released = true;
      } else {
        ghost.dx = 0;
        ghost.dy = 0;
        return; // Skip movement
      }
    }

    // Determine possible directions
    const possibleDirs = [];
    if (canMove(ghost.x, ghost.y, GHOST_SPEED, 0)) possibleDirs.push('right');
    if (canMove(ghost.x, ghost.y, -GHOST_SPEED, 0)) possibleDirs.push('left');
    if (canMove(ghost.x, ghost.y, 0, -GHOST_SPEED)) possibleDirs.push('up');
    if (canMove(ghost.x, ghost.y, 0, GHOST_SPEED)) possibleDirs.push('down');

    // Avoid reverse
    const reverse = getReverse(ghost.direction);
    if (possibleDirs.length > 1) possibleDirs = possibleDirs.filter(d => d !== reverse);

    // Basic pursuit for first ghost, random for others
    let newDir;
    if (index === 0 && !ghost.scared) {
      // Pursuit: choose direction towards Pacman
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

    // Set new direction
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
        ctx.drawImage(images['pellet_small'], x * TILE_SIZE + TILE_SIZE / 4, y * TILE_SIZE + TILE_SIZE / 4, TILE_SIZE / 2, TILE_SIZE / 2);
      } else if (currentMaze[y][x] === 3) {
        ctx.drawImage(images['pellet_large'], x * TILE_SIZE + TILE_SIZE / 4, y * TILE_SIZE + TILE_SIZE / 4, TILE_SIZE / 2, TILE_SIZE / 2);
      } else if (currentMaze[y][x] === 5) {
        ctx.fillStyle = 'pink';
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE + TILE_SIZE / 2, TILE_SIZE, 2);
      }
    }
  }

  // Draw Pacman
  const pacImg = images[`pacman_${pacman.direction}_${pacman.mouthOpen ? 'open' : 'closed'}`];
  ctx.drawImage(pacImg, pacman.x, pacman.y, TILE_SIZE, TILE_SIZE);

  // Draw ghosts
  ghosts.forEach(ghost => {
    const mode = ghost.scared ? 'scared' : (ghost.dx === 0 && ghost.dy === 0 ? 'normal' : ghost.direction);
    let ghostImg = images[`ghost${ghost.id}_${mode}`];
    ctx.drawImage(ghostImg, ghost.x, ghost.y, TILE_SIZE, TILE_SIZE);
  });

  // Draw cherry
  if (cherryActive) {
    ctx.drawImage(images['cherry'], cherryX, cherryY, TILE_SIZE, TILE_SIZE);
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
