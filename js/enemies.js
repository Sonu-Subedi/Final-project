const maxEnemiesPerWave = [3, 7, 10];
const enemySpawnIntervals = [200, 150, 100];
let currentWave = 0;
let currentLevel = 1;
let enemiesPassed = 0;
let waveMessageShownTime = 0;
walkingAudio.volume = 0.5;
walkingAudio.loop = true;

const enemyTypes = [];
const enemy1 = new Image();
enemy1.src = "./images/Zombies/BucketheadZombie/4.png";
enemyTypes.push(enemy1);
const enemy2 = new Image();
enemy2.src = "./images/Zombies/ConeheadZombie/4.png";
enemyTypes.push(enemy2);
const enemy3 = new Image();
enemy3.src = "./images/Zombies/ZombieSprite.png";
enemyTypes.push(enemy3);
class Enemy {
  constructor(verticalPosition) {
    this.x = canvas.width - 100;
    this.y = verticalPosition;
    this.width = cellSize - cellGap * 2;
    this.height = cellSize - cellGap * 2;
    this.speed = Math.random() * 0.01 + 0.4;
    this.movement = this.speed;
    this.health = 100;
    this.maxHealth = this.health;

    this.enemyTypes = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
    this.enemyType = "";

    if (this.enemyTypes.src === enemy1.src) {
      this.enemyType = "enemy1";
    } else if (this.enemyTypes.src === enemy2.src) {
      this.enemyType = "enemy2";
    } else if (this.enemyTypes.src === enemy3.src) {
      this.enemyType = "enemy3";
    } else if (this.enemyTypes.src === enemy4.src) {
      this.enemyType = "enemy4";
    } else if (this.enemyTypes.src === enemy5.src) {
      this.enemyType = "enemy5";
    }

    this.frameX = 0;
    this.frameY = 0;
    this.minFrameX = 0;
    this.minFrameY = 0;
    this.maxFrameX = 11;
    this.maxFrameY = 3;
    this.spriteWidth = 1826;
    this.spriteHeight = 432;
    this.currentImageWidth = this.spriteWidth / 11;
    this.currentImageHeight = this.spriteHeight / 3;
  }

  update() {
    this.x -= this.movement;

    if (frame % 3 === 0) {
      this.frameX++;

      if (this.frameX >= this.maxFrameX) {
        if (this.frameY < this.maxFrameY) {
          this.frameX = 0;
          this.frameY++;
        } else {
          this.frameX = 0;
          this.frameY = 0;
        }
      }
    }

    if (this.enemyType === "enemy4") {
      if (frame % 5 === 0) {
        this.frameX++;
        this.currentImageWidth = 1822 / 11;
        this.currentImageHeight = 300;
        this.maxFrameX = 12;
        this.maxFrameY = 2;

        if (this.frameX >= this.maxFrameX) {
          this.frameX = 0;
          this.frameY++;
          if (this.frameY >= this.maxFrameY) {
            this.frameY = 0;
          }
        }
      }
    }

    if (this.movement !== 0) {
      walkingAudio.play();
    }
  }
  draw() {
    ctx.drawImage(
      this.enemyTypes,
      this.frameX * this.currentImageWidth,
      this.frameY * this.currentImageHeight,
      this.currentImageWidth,
      this.currentImageHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

function handleEnemies() {
  if (currentWave < maxEnemiesPerWave.length) {
    if (enemiesPassed < maxEnemiesPerWave[currentWave]) {
      if (frame % enemySpawnIntervals[currentWave] === 0) {
        let verticalPositions = [280, 430, 600];
        let randomPositionIndex = Math.floor(
          Math.random() * verticalPositions.length
        );
        let verticalPosition = verticalPositions[randomPositionIndex];

        enemies.push(new Enemy(verticalPosition));
        enemyPositions.push(verticalPosition);
      }
    } else {
      currentWave++;
      enemiesPassed = 0;
      waveMessageShownTime = Date.now();
      if (currentWave < maxEnemiesPerWave.length) {
        ctx.fillStyle = "red";
        ctx.font = "30px Orbitron";
        ctx.fillText(
          "Wave " + (currentWave + 1) + " is approaching!",
          canvas.width / 2 - 200,
          canvas.height / 2
        );
      }
    }
  }

  for (let i = 0; i < enemies.length; i++) {
    enemies[i].update();
    enemies[i].draw();

    if (enemies[i].x < 300) {
      gameOver = true;
    }

    if (enemies[i].health <= 0) {
      let gainedResources = enemies[i].maxHealth / 10;
      floatingMessagesArray.push(
        new floatingMessages(
          "+" + gainedResources,
          enemies[i].x,
          enemies[i].y,
          30,
          "black"
        )
      );
      enemiesPassed++;
      if (enemiesPassed % 10 === 0) {
        currentWave++;
        if (enemiesInterval > 120) {
          enemiesInterval -= 50;
        }
        waveMessageShownTime = Date.now();

        if (Date.now() - waveMessageShownTime < 5000) {
          ctx.fillStyle = "red";
          ctx.font = "30px Orbitron";
          ctx.fillText(
            "Wave " + currentWave + " is approaching!",
            canvas.width / 2 - 200,
            canvas.height / 2
          );
        }
      }
      floatingMessagesArray.push(
        new floatingMessages("+" + gainedResources, 250, 50, 20, "gold")
      );
      numberOfResources += gainedResources;
      score += gainedResources;
      const findThisIndex = enemyPositions.indexOf(enemies[i].y);
      enemyPositions.splice(findThisIndex, 1);
      enemies.splice(i, 1);
      i--;
    }
  }

  const timeElapsed = Date.now() - waveMessageShownTime;

  if (timeElapsed < 5000) {
    ctx.fillStyle = "red";
    ctx.font = "30px Orbitron";
    ctx.fillText(
      "Wave " + (currentWave + 1) + " is approaching!",
      canvas.width / 2 - 200,
      canvas.height / 2
    );
  }
}
