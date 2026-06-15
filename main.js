const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const scoreEl = document.getElementById('score');

// ボール
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 30,
  radius: 8,
  dx: 3,
  dy: -3,
};

// パドル
const paddle = {
  width: 75,
  height: 10,
  x: (canvas.width - 75) / 2,
};

// ブロック
const block = {
  rowCount: 4,
  colCount: 7,
  width: 55,
  height: 18,
  padding: 8,
  offsetTop: 30,
  offsetLeft: 18,
};

const blocks = [];
for (let r = 0; r < block.rowCount; r++) {
  blocks[r] = [];
  for (let c = 0; c < block.colCount; c++) {
    blocks[r][c] = { x: 0, y: 0, active: true };
  }
}

let score = 0;
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', (e) => {
  if (e.key === 'ArrowRight') rightPressed = true;
  if (e.key === 'ArrowLeft') leftPressed = true;
});

document.addEventListener('keyup', (e) => {
  if (e.key === 'ArrowRight') rightPressed = false;
  if (e.key === 'ArrowLeft') leftPressed = false;
});

function drawBall() {
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.fillStyle = '#f00';
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddle.x, canvas.height - block.height, paddle.width, paddle.height);
  ctx.fillStyle = '#0f0';
  ctx.fill();
  ctx.closePath();
}

function drawBlocks() {
  for (let r = 0; r < block.rowCount; r++) {
    for (let c = 0; c < block.colCount; c++) {
      if (!blocks[r][c].active) continue;
      const x = c * (block.width + block.padding) + block.offsetLeft;
      const y = r * (block.height + block.padding) + block.offsetTop;
      blocks[r][c].x = x;
      blocks[r][c].y = y;
      ctx.beginPath();
      ctx.rect(x, y, block.width, block.height);
      ctx.fillStyle = '#f80';
      ctx.fill();
      ctx.closePath();
    }
  }
}

function collisionDetection() {
  for (let r = 0; r < block.rowCount; r++) {
    for (let c = 0; c < block.colCount; c++) {
      const b = blocks[r][c];
      if (!b.active) continue;
      if (
        ball.x > b.x &&
        ball.x < b.x + block.width &&
        ball.y > b.y &&
        ball.y < b.y + block.height
      ) {
        ball.dy = -ball.dy;
        b.active = false;
        score++;
        scoreEl.textContent = score;
      }
    }
  }
}

function drawGameOver() {
  ctx.font = '32px sans-serif';
  ctx.fillStyle = '#fff';
  ctx.textAlign = 'center';
  ctx.fillText('ゲームオーバー', canvas.width / 2, canvas.height / 2);
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawBlocks();
  drawBall();
  drawPaddle();
  collisionDetection();

  // 壁との当たり判定
  if (ball.x + ball.dx > canvas.width - ball.radius || ball.x + ball.dx < ball.radius) {
    ball.dx = -ball.dx;
  }
  if (ball.y + ball.dy < ball.radius) {
    ball.dy = -ball.dy;
  } else if (ball.y + ball.dy > canvas.height - ball.radius - block.height) {
    // パドルとの当たり判定
    if (ball.x > paddle.x && ball.x < paddle.x + paddle.width) {
      ball.dy = -ball.dy;
    } else if (ball.y + ball.dy > canvas.height - ball.radius) {
      drawGameOver();
      return;
    }
  }

  // パドル操作
  if (rightPressed && paddle.x < canvas.width - paddle.width) {
    paddle.x += 5;
  } else if (leftPressed && paddle.x > 0) {
    paddle.x -= 5;
  }

  ball.x += ball.dx;
  ball.y += ball.dy;

  requestAnimationFrame(draw);
}

draw();
