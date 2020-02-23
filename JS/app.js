const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//variables

//vitesse sur X et y
let vx = 10;
let vy = 0;

let pommeX = random();
let pommeY = random();

let snake = [
  { x: 130, y: 150 },
  { x: 120, y: 150 },
  { x: 110, y: 150 },
  { x: 100, y: 150 }
];

let score = 0;

let bugDirection = false;
let stopGame = false;

function animation() {
  if (stopGame === true) {
    return;
  } else {
    setTimeout(function() {
      bugDirection = false;
      nettoieCanvas();
      dessinePomme();
      faireAvancerLeSerpent();

      dessineLeSerpent();
      animation();
    }, 100);
  }
}

animation();
dessinePomme();

function dessineLesMorceaux(morceaux) {
  ctx.fillStyle = "#00fe14";
  ctx.strokeStyle = "black";

  ctx.fillRect(morceaux.x, morceaux.y, 10, 10);
  ctx.strokeRect(morceaux.x, morceaux.y, 10, 10);
}

function dessineLeSerpent() {
  snake.forEach((morceaux) => {
    dessineLesMorceaux(morceaux);
  });
}

function faireAvancerLeSerpent() {
  const head = { x: snake[0].x + vx, y: snake[0].y + vy };
  snake.unshift(head);

  if (finDuJeu()) {
    snake.shift(head);
    recommencer();
    stopGame = true;
    return;
  }

  const serpentMangePomme = snake[0].x === pommeX && snake[0].y === pommeY;
  if (serpentMangePomme) {
    score += 10;
    document.getElementById("score").innerHTML = score;
    createApple();
  } else {
    snake.pop();
  }
}

function nettoieCanvas() {
  ctx.fillStyle = "white";
  ctx.strokeStyle = "black";

  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeRect(0, 0, canvas.width, canvas.height);
}

dessineLeSerpent();

document.addEventListener("keydown", () => changerDirection(event));

function changerDirection(event) {
  if (bugDirection) return;
  bugDirection = true;

  const flecheGauche = 37;
  const flecheHaut = 38;
  const flecheDroite = 39;
  const flecheBas = 40;

  const direction = event.keyCode;

  const monter = vy === -10;
  const descendre = vy === 10;
  const aDroite = vx === 10;
  const aGauche = vx === -10;

  if (direction === flecheGauche && !aDroite) {
    vx = -10;
    vy = 0;
  }
  if (direction === flecheHaut && !descendre) {
    vx = 0;
    vy = -10;
  }
  if (direction === flecheDroite && !aGauche) {
    vx = 10;
    vy = 0;
  }
  if (direction === flecheBas && !monter) {
    vx = 0;
    vy = 10;
  }
}

function random() {
  return Math.round(Math.random() * 29) * 10;
}

function createApple() {
  pommeX = random();
  pommeY = random();

  snake.forEach(function(part) {
    const serpentSurPomme = part.x == pommeX && part.y == pommeY;

    if (serpentSurPomme) {
      createApple();
    }
  });
}

function dessinePomme() {
  ctx.fillStyle = "red";
  ctx.strokeStyle = "darkred";
  ctx.beginPath();
  ctx.arc(pommeX + 5, pommeY + 5, 5, 0, 2 * Math.PI);
  ctx.fill();
  ctx.stroke();
}

function finDuJeu() {
  let snakeSansTete = snake.slice(1, -1);
  let mordu = false;
  snakeSansTete.forEach((morceau) => {
    if (morceau.x === snake[0].x && morceau.y === snake[0].y) {
      mordu = true;
    }
  });
  const toucheMurGauche = snake[0].x < -1;
  const toucheMurDroit = snake[0].x > canvas.width - 10;
  const toucheMurHaut = snake[0].y < -1;
  const toucheMurBas = snake[0].y > canvas.height - 10;

  let gameOver = false;

  if (
    mordu ||
    toucheMurBas ||
    toucheMurDroit ||
    toucheMurGauche ||
    toucheMurHaut
  ) {
    gameOver = true;
  }
  return gameOver;
}

function recommencer() {
  const restart = document.getElementById("recommencer");
  restart.style.display = "block";

  document.addEventListener("keydown", (e) => {
    if (e.keyCode === 32) {
      document.location.reload(true);
    }
  });
}
