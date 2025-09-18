let serial;
let latestData = "";
let joyX = 500;
let smoothJoy = 500;

// Pong objects
let ball = { x: 300, y: 200, dx: 4, dy: 3, r: 10 };
let paddleH = 120;
let paddleW = 12;
let leftY = 200;
let rightY = 200;
let SFX;

// total scores
let leftScore = 0;
let rightScore = 0;

function preload(){
  SFX = loadSound("ping.mp3")
}

function setup() {
  createCanvas(windowWidth-70, windowHeight);

  // take in serial data for board
  serial = new p5.SerialPort();
  serial.list();
  serial.on("data", serialEvent);
  serial.openPort("COM3"); // adjust your port
}

function draw() {
  background(30);

  // ai
  let aiSpeed = 2;
  if (leftY < ball.y - 10) leftY += aiSpeed;
  if (leftY > ball.y + 10) leftY -= aiSpeed;
  leftY = constrain(leftY, paddleH / 2, height - paddleH / 2);

  // smoothing
  let smoothing = 0.1; // lower = smoother
  smoothJoy += (joyX - smoothJoy) * smoothing;
  rightY = map(smoothJoy, 458, 540, height - paddleH / 2, paddleH / 2);
  rightY = constrain(rightY, paddleH / 2, height - paddleH / 2);

  // ball movements
  ball.x += ball.dx;
  ball.y += ball.dy;

  // collide with roof
  if (ball.y < ball.r || ball.y > height - ball.r) {
    ball.dy *= -1;
    SFX.play();
  }

  // collide with paddles
  if (ball.x - ball.r < paddleW && abs(ball.y - leftY) < paddleH / 2) {
    ball.dx *= -1;
    ball.x = paddleW + ball.r;
    SFX.play();
  }
  if (
    ball.x + ball.r > width - paddleW &&
    abs(ball.y - rightY) < paddleH / 2
  ) {
    ball.dx *= -1;
    ball.x = width - paddleW - ball.r;
    SFX.play();
  }

  // reset game
  if (ball.x < 0) {
    rightScore++;
    resetBall();
  }
  if (ball.x > width) {
    leftScore++;
    resetBall();
  }

  // the paddles
  noStroke();
  fill(255);
  rect(0, leftY - paddleH / 2, paddleW, paddleH);
  rect(width - paddleW, rightY - paddleH / 2, paddleW, paddleH);
  ellipse(ball.x, ball.y, ball.r * 2);

  // display the scores
  textSize(32);
  textAlign(CENTER);
  text(leftScore, width / 4, 50);
  text(rightScore, (3 * width) / 4, 50);
}

function resetBall() {
  ball.x = width / 2;
  ball.y = height / 2;
  ball.dx = random([-4, 4]);
  ball.dy = random([-3, 3]);
}

// serial data
function serialEvent() {
  let data = serial.readLine().trim();
  if (!data) return;

  latestData = data;

  let value = parseInt(data);
  if (!isNaN(value)) {
    joyX = value;
  }
}
