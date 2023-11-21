const canvas = document.getElementById("canvas");
const startButton = document.getElementById("startButton");
const startmenu = document.getElementById("startmenu");
const walkingAudio = document.getElementById("walkingAudio");
const restartButton = document.getElementById("restartButton");
const highestScoreElement = document.getElementById("highestScore");

const ctx = canvas.getContext("2d");
canvas.width = 1500;
canvas.height = 900;
let gameState = "start";

// /Global variables
const cellSize = 150;
const cellGap = 0;
const allowedRowPositions = [280, 430, 600];

let numberOfResources = 300;
let enemiesInterval = 600;
let frame = 0;
let gameOver = false;
let score = 0;
let winningScore = 50;
let highestScore = 0;
let choosenDefender = 1;
const gameGrid = [];
let defenders = [];
let enemies = [];
let enemyPositions = [];
let projectiles = [];
let resources = [];
const backgroundImage = new Image();
backgroundImage.onload = function () {
  ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
};

backgroundImage.src = "./images/interface/background22.jpg";
///shovel icon
const shovelIconX = 180;
const shovelIconY = 30;
const shovelIconWidth = 80;
const shovelIconHeight = 80;
const shovelIcon = new Image();
shovelIcon.src = "./images/shovelcon.png";

let shovelActive = false;

canvas.addEventListener("click", function () {
  if (
    mouse.x >= shovelIconX &&
    mouse.x <= shovelIconX + shovelIconWidth &&
    mouse.y >= shovelIconY &&
    mouse.y <= shovelIconY + shovelIconHeight
  ) {
    activateShovel();
  }
});

function activateShovel() {
  shovelActive = true;
}

function deactivateShovel() {
  shovelActive = false;
}

function drawShovelIcon() {
  ctx.fillStyle = "rgba(255, 255, 255, 1.5)";
  ctx.fillRect(shovelIconX, shovelIconY, shovelIconWidth, shovelIconHeight);

  ctx.drawImage(
    shovelIcon,
    shovelIconX,
    shovelIconY,
    shovelIconWidth,
    shovelIconHeight
  );
}

// mouse
const mouse = {
  x: 10,
  y: 10,
  width: 0.1,
  height: 0.1,
  clicked: false,
};

canvas.addEventListener("mousedown", function () {
  mouse.clicked = true;
});

canvas.addEventListener("mouseup", function () {
  mouse.clicked = false;
});

let canvasPosition = canvas.getBoundingClientRect();
canvas.addEventListener("mousemove", function (e) {
  mouse.x = e.x - canvasPosition.left;
  mouse.y = e.y - canvasPosition.top;
});
canvas.addEventListener("mouseleave", function () {
  mouse.x = undefined;
  mouse.y = undefined;
});

//floating message
let floatingMessagesArray = [];
class floatingMessages {
  constructor(value, x, y, size, color) {
    this.value = value;
    this.x = x;
    this.y = y;
    this.size = size;
    this.lifeSpan = 0;
    this.color = color;
    this.opacity = 1;
  }
  update() {
    this.y -= 0.3;
    this.lifeSpan += 1;
    if (this.opacity > 0.05) {
      this.opacity -= 0.05;
    }
  }
  draw() {
    ctx.globalAlpha = this.opacity;
    ctx.fillStyle = this.color;
    ctx.font = this.size + "px Orbitron";
    ctx.fillText(this.value, this.x, this.y);
    ctx.globalAlpha = 1;
  }
}
function handlefloatingMessages() {
  for (let i = 0; i < floatingMessagesArray.length; i++) {
    floatingMessagesArray[i].update();
    floatingMessagesArray[i].draw();
    if (floatingMessagesArray[i].lifeSpan >= 50) {
      floatingMessagesArray.splice(i, 1);
      i--;
    }
  }
}

// // Utilities

highestScoreElement.textContent = `Highest Score: ${highestScore}`;
highestScoreElement.style.color = "red";
function handleGameStatus() {
  ctx.fillStyle = "black";
  ctx.font = "20px Orbitron";
  ctx.fillText("Score: " + score, 900, 40);

  ctx.fillText("Resources: " + numberOfResources, 900, 80);

  if (score >= winningScore && enemies.length === 0) {
    ctx.fillStyle = "white";
    ctx.font = "60px Orbitron";
    ctx.fillText("Level Completed", 436, 330);
    ctx.font = "30px Orbitron";

    ctx.fillText("You win with " + score + " points!", 436, 440);
  }
  if (score > highestScore) {
    highestScore = score;
    localStorage.setItem("highestScore", highestScore); // Save the highest score in local storage
    highestScoreElement.textContent = `Highest Score: ${highestScore}`;
    highestScoreElement.style.color = "red";
  }
}

////Event listener

const grid = [];
const numRows = 3;
const numCols = 8;
const allowedColumns = 7;

for (let row = 0; row < numRows; row++) {
  grid[row] = [];
  for (let col = 0; col < numCols; col++) {
    grid[row][col] = false;
  }
}
canvas.addEventListener("click", function () {
  const gridPositionX = mouse.x - (mouse.x % cellSize) + cellGap;
  const gridPositionY = mouse.y - (mouse.y % cellSize) + cellGap;

  const defenderCost = 100;
  let defenderRow = -1;
  if (numberOfResources >= defenderCost) {
    // Find the row based on gridPositionY
    for (let i = 0; i < allowedRowPositions.length; i++) {
      if (
        gridPositionY >= allowedRowPositions[i] &&
        gridPositionY < allowedRowPositions[i] + cellSize
      ) {
        defenderRow = i;
        break;
      }
    }

    if (defenderRow !== -1) {
      let column = Math.floor((gridPositionX - 260) / cellSize);
      if (column >= 0 && column < allowedColumns) {
        if (!grid[defenderRow][column]) {
          let defenderX = 260 + column * cellSize;
          let defenderY = allowedRowPositions[defenderRow];
          console.log(defenderX, defenderY);
          const newDefender =
            choosenDefender == 1
              ? new Sunflower(defenderX, defenderY)
              : choosenDefender == 2
              ? new Peashooter(defenderX, defenderY)
              : choosenDefender == 3
              ? new CherryBomb(defenderX, defenderY)
              : choosenDefender == 4
              ? new Walnut(defenderX, defenderY)
              : new Defenders(defenderX, defenderY);

          defenders.push(newDefender);
          numberOfResources -= defenderCost;

          grid[defenderRow][column] = true;
        } else {
          floatingMessagesArray.push(
            new floatingMessages(
              "Position already occupied by a defender!",
              mouse.x,
              mouse.y,
              20,
              "red"
            )
          );
        }
      }
    }
  } else {
    floatingMessagesArray.push(
      new floatingMessages(
        "Not enough resources!",
        mouse.x,
        mouse.y,
        20,
        "blue"
      )
    );
  }
});

canvas.addEventListener("click", () => {
  if (gameState === "start") {
    gameState = "play";
    startGame();
  }
});
function startGame() {
  gameState = "play";
  document.querySelector(".start-menu").style.display = "none";
  canvas.style.display = "block";
  animate();
}

startButton.addEventListener("click", () => {
  console.log("Button clicked.");
  canvas.classList.remove("hide");
  startmenu.classList.add("hide");
  // console.log("Game started.");
  startGame();
});
let deltaTime;
let lastTime = 0;

function animate(timestamp) {
  const deltaTime = (timestamp - lastTime) / 10000;
  lastTime = timestamp;
  if (gameState === "play") {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(backgroundImage, 0, 0, canvas.width, canvas.height);
    drawShovelIcon();
    if (shovelActive) {
      canvas.addEventListener("click", function () {
        for (let i = 0; i < defenders.length; i++) {
          const defender = defenders[i];

          if (
            collision(defender, { x: mouse.x, y: mouse.y, width: 1, height: 1 })
          ) {
            defenders.splice(i, 1);
            score += 20;
          }
        }
      });
    }

    handleDefenders();
    handleProjectiles();
    handleEnemies();
    chooseDefender();
    handleGameStatus();
    handlefloatingMessages();
    handleSunrays();

    // ///for lawnmover
    for (const lawnCleaner of lawnCleaners) {
      lawnCleaner.draw();
    }
    for (const cleaner of lawnCleaners) {
      cleaner.update();
    }

    frame++;

    if (!gameOver) {
      requestAnimationFrame(animate);
    } else {
      const gameOverContainer = document.getElementById("gameOverContainer");
      gameOverContainer.style.display = "block";
    }
  }
}
animate();

function restartGame() {
  gameState = "play";
  gameOver = false;
  score = 0;
  numberOfResources = 300;
  frame = 0;
  enemies = [];
  defenders = [];
  projectiles = [];
  resources = [];
  floatingMessagesArray = [];
  lastTime = 0;
  lawnCleaners.length = 0;

  const rowPositions = [280, 430, 600];
  for (const y of rowPositions) {
    const newLawnCleaner = new LawnCleaner(y);
    lawnCleaners.push(newLawnCleaner);
  }

  gameOverContainer.style.display = "none";
  animate();
}

restartButton.addEventListener("click", function () {
  restartGame();
});
function collision(first, second) {
  if (
    !(
      first.x > second.x + second.width ||
      first.x + first.width < second.x ||
      first.y > second.y + second.height ||
      first.y + first.height < second.y
    )
  ) {
    return true;
  }
  return false;
}

window.addEventListener("resize", function () {
  canvasPosition = canvas.getBoundingClientRect();
});
