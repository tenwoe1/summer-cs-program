let gameState = "start";
let player;
let platforms = [];
let goal;
let img;
let playerImg;
let opacity = 0;  // Start fully invisible

let obstacles = [
  { x: 210 + 200, y: 533, w: 23, h: 23 },
  { x: 60 + 290, y: 333, w: 23, h: 23 },
  { x: 350, y: 100, w: 23, h: 23 }
];

let score = 0;
let gameOver = false;

let restartButton;

function preload() {
  img = loadImage('Mountain.gif'); // Background image
  playerImg = loadImage('Dorjee.gif'); // Player character image
}

function setup() {
  createCanvas(706, 675);
  goal = createVector(630, 30); // Goal position
  player = new Player(65, 620); // Start player position

  // Define platforms
  platforms = [
    new Platform(60, 645, 150, 45),
    new Platform(60 + 150, 645 - 45, 150, 45),
    new Platform(210 + 150, 600 - 45, 150, 45),
    new Platform(360 + 150, 555 - 45, 150, 45),
    new Platform(510 + 150, 510 - 45, 150, 45),
    new Platform(210 + 230, 600 - 200, 150, 45),
    new Platform(60 + 230, 555 - 200, 150, 45),
    new Platform(370 - 230, 510 - 200, 150, 45),
    new Platform(140, 310, 150, 45),
    new Platform(-10, 265, 150, 45),
    new Platform(150, 168, 150, 45),
    new Platform(300, 123, 150, 45),
    new Platform(450, 80, 260, 45)
  ];
  
  // Create the restart button but hide it for now
  restartButton = createButton("Restart");
  restartButton.position(width / 2 - 40, height / 2 + 20);
  restartButton.mousePressed(restartGame);
  restartButton.hide();
}

function draw() {
  background(img);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    drawPlayScreen();
  } else if (gameState === "win") {
    drawWinScreen();
  } else if (gameState === "end") {
    drawEndScreen();
  }

  // Only check for collisions if the game is playing
  if (gameState === "play") {
    checkCollisions();
  }

  // Show score
  fill(0);
  textSize(14);
  textAlign(LEFT);
  text("Collisions: " + score, 10, 20);
}

function checkCollisions() {
  // Draw obstacles
  fill(255, 0, 0, 150);
  for (let obs of obstacles) {
    rect(obs.x, obs.y, obs.w, obs.h);

    // Check for collision with player
    if (
      player.x + player.w > obs.x &&
      player.x < obs.x + obs.w &&
      player.y + player.h > obs.y &&
      player.y < obs.y + obs.h
    ) {
      score++;
      player.respawn(); // Respawn player
      break;
    }
  }

  // Game Over logic
  if (score >= 3) {
    gameOver = true;
    gameState = "end";
    restartButton.show(); // Show restart button
  }
}

function drawStartScreen() {
  textAlign(CENTER);
  fill(255);
  textSize(40);
  text("Journey's Beginning", width / 2, height / 2 - 60);
  textSize(32);
  text("Land of Snow", width / 2, height / 2 - 10);
  textSize(20);
  text("Click Anywhere to Start", width / 2, height / 2 + 30);
}

function drawPlayScreen() {
  player.move();
  player.display();

  // Draw platforms
  for (let p of platforms) {
    p.display();
  }

  // Draw goal
  fill(0, 255, 0);
  rect(goal.x, goal.y, 40, 40);

  // Check win condition
  if (player.reaches(goal)) {
    gameState = "win";
  }
}

function drawWinScreen() {
  background(0, 200, 100);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("🎉 You Reached the Goal! 🎉", width / 2, height / 2);
  textSize(20);
  text("Click to Restart", width / 2, height / 2 + 40);
}

function drawEndScreen() {
  background(200, 50, 50);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("Game Over", width / 2, height / 2);
  textSize(20);
}

function mousePressed() {
  if (gameState === "start") {
    gameState = "play";
  } else if (gameState === "win" || gameState === "end") {
    restartGame();
  }
}

function restartGame() {
  player.respawn();
  gameState = "start";
  score = 0; // Reset score
  gameOver = false;
  restartButton.hide();
}

class Platform {
  constructor(x, y, w, h) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
  }

  display() {
    fill(200);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Player {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.w = 30;
    this.h = 40;
    this.ySpeed = 0;
    this.xSpeed = 0;
    this.onGround = false;
  }

  move() {
    this.xSpeed = 0;
    if (keyIsDown(LEFT_ARROW)) this.xSpeed = -3;
    if (keyIsDown(RIGHT_ARROW)) this.xSpeed = 3;
    this.x += this.xSpeed;

    this.ySpeed += 0.8; // Gravity
    this.y += this.ySpeed;

    this.onGround = false;

    // Collision with platforms
    for (let p of platforms) {
      if (
        this.x + this.w > p.x &&
        this.x < p.x + p.w &&
        this.y + this.h > p.y &&
        this.y + this.h < p.y + p.h &&
        this.ySpeed >= 0
      ) {
        this.y = p.y - this.h;
        this.ySpeed = 0;
        this.onGround = true;
      }
    }

    // Stay inside canvas
    this.x = constrain(this.x, 0, width - this.w);
    if (this.y > height) this.respawn();
  }

  jump() {
    if (this.onGround) this.ySpeed = -12;
  }

  respawn() {
    this.x = 65;
    this.y = 620;
    this.ySpeed = 0;
  }

  display() {
    image(playerImg, this.x, this.y, this.w, this.h);
  }

  reaches(goal) {
    return dist(this.x, this.y, goal.x, goal.y) < 30;
  }
}

function keyPressed() {
  if (gameOver) return; // If the game is over, don't allow input
  if (key === ' ' || keyCode === UP_ARROW) {
    player.jump();
  }
}

