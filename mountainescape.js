let gameState = "start";
let player;
let platforms = [];
let goal;
let img;
let playerImg;

function preload() {
  img = loadImage('mountain.gif'); // Background image
  playerImg = loadImage('dorjee.gif'); // Player character image
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
    new Platform(450, 80, 260, 45) // Commas now added after every platform
  ];
}

function draw() {
  background(img);

  if (gameState === "start") {
    drawStartScreen();
  } else if (gameState === "play") {
    drawPlayScreen();
  } else if (gameState === "win") {
    drawWinScreen();
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

function mousePressed() {
  if (gameState === "start") {
    gameState = "play";
  } else if (gameState === "win") {
    player.respawn();
    gameState = "start";
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
    image(playerImg, this.x, this.y, 800, 40);
  }

  reaches(goal) {
    return dist(this.x, this.y, goal.x, goal.y) < 30;
  }
}

function keyPressed() {
  if (key === ' ' || keyCode === UP_ARROW) {
    player.jump();
  }
}
