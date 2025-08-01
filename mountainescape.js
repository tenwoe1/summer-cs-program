let gameState = "start";
let player;
let platforms = [];
let goal;
let img;
let playerImg;
let startScreenImg; 
let opacity = 0;

let obstacles = [
  { x: 210 + 200, y: 533, w: 23, h: 23 },
  { x: 60 + 290, y: 333, w: 23, h: 23 },
  { x: 350, y: 100, w: 23, h: 23 }
];

let score = 0;
let gameOver = false;

let currentLevel = 1;
const totalLevels = 6;

let restartButton;

function preload() {
  img = loadImage('Mountain.gif'); // Background image for gameplay
  playerImg = loadImage('Dorjee.gif'); // Player character image
  startScreenImg = loadImage('Sky.gif'); // Your new start screen background image
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
  if (gameState === "start") {
    drawStartScreen();
  } else {
    background(img);
    if (gameState === "play") {
      drawPlayScreen();
    } else if (gameState === "win") {
      drawWinScreen();
    } else if (gameState === "end") {
      drawEndScreen();
    }

    if (gameState === "play") {
      checkCollisions();
    }

    fill(225);
    textSize(28);
    textAlign(LEFT);
    text("Lives Wasted: " + score, 10, 20);
    text("Level: " + currentLevel, 10, 50);
  }
}

function checkCollisions() {
  fill(255);
  for (let obs of obstacles) {
    rect(obs.x, obs.y, obs.w, obs.h);

    if (
      player.x + player.w > obs.x &&
      player.x < obs.x + obs.w &&
      player.y + player.h > obs.y &&
      player.y < obs.y + obs.h
    ) {
      score++;
      player.respawn();
      break;
    }
  }

  if (score >= 3) {
    gameOver = true;
    gameState = "end";
    restartButton.show();
  }
}

function drawStartScreen() {
  background(startScreenImg); // Use the new image for the start screen
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

  for (let p of platforms) {
    p.display();
  }

  fill(0, 255, 0);
  rect(goal.x, goal.y, 40, 40);

  checkWin();
}

function drawWinScreen() {
  background(0, 200, 100);
  textAlign(CENTER);
  fill(255);
  textSize(32);
  text("🎉 You Completed All Levels! 🎉", width / 2, height / 2);
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
  currentLevel = 1;
  score = 0;
  gameState = "start";
  gameOver = false;
  restartButton.hide();
}

function checkWin() {
  if (player.reaches(goal)) {
    currentLevel++;
    if (currentLevel > totalLevels) {
      gameState = "win";
    } else {
      player.respawn();
    }
  }
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
    this.jumpCount = 0;
  }

  move() {
    this.xSpeed = 0;
    if (keyIsDown(LEFT_ARROW)) this.xSpeed = -3;
    if (keyIsDown(RIGHT_ARROW)) this.xSpeed = 3;
    this.x += this.xSpeed;

    this.ySpeed += 0.8; 
    this.y += this.ySpeed;
    this.onGround = false;

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
        this.jumpCount = 0;
      }
    }

    this.x = constrain(this.x, 0, width - this.w);
    if (this.y > height) this.respawn();
  }

  jump() {
    if (this.onGround || this.jumpCount < 2) {
      this.ySpeed = -12;
      this.jumpCount++;
    }
  }

  respawn() {
    this.x = 65;
    this.y = 620;
    this.ySpeed = 0;
    this.jumpCount = 0;
  }

  display() {
    image(playerImg, this.x, this.y, this.w, this.h);
  }

  reaches(goal) {
    return dist(this.x, this.y, goal.x, goal.y) < 30;
  }
}

function keyPressed() {
  if (gameOver) return;
  if (key === ' ' || keyCode === UP_ARROW) {
    player.jump();
  }
}

