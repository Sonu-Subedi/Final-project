const defender1icon = new Image();

defender1icon.src = "./images/Plants/Sunflower/0.gif";

const defender2icon = new Image();
defender2icon.src = "./images/Plants/Peashooter/0.gif";

const defender3icon = new Image();

defender3icon.src = "./images/Plants/CherryBomb/0.gif";
const defender4icon = new Image();

defender4icon.src = "./images/Plants/WallNut/0.gif";

// defendersprites
const defender1 = new Image();

defender1.src = "./images/Plants/Sunflower/4.png";

const defender2 = new Image();
defender2.src = "./images/Plants/Peashooter/4.png";

const defender3 = new Image();

defender3.src = "./images/Plants/CherryBomb/0.gif";
const defender4 = new Image();

defender4.src = "./images/Plants/WallNut/4.png";

class Defenders {
  constructor(x, y, type, movement) {
    this.x = x + 100;
    const closestAllowedRow = allowedRowPositions.reduce((prevRow, currRow) => {
      if (Math.abs(y - currRow) < Math.abs(y - prevRow)) {
        return currRow;
      } else {
        return prevRow;
      }
    }, allowedRowPositions[0]);
    this.y = closestAllowedRow;

    (this.width = 100), (this.height = 100), (this.shooting = false);
    this.shootNow = false;
    this.health = 100;
    this.projectiles = [];
    this.timer = 0;
    this.frameX = 0;
    this.frameY = 0;
    this.minFrameX = 0;
    this.maxFrameX = 10;
    this.spriteWidth = 365;
    this.spriteHeight = 330;
    this.currentImageWidth = this.spriteWidth / 5;
    this.currentImageHeight = this.spriteHeight / 5;
    this.choosenDefender = choosenDefender;
    this.type = type;
    this.movement = movement;
  }
  draw() {
    console.log(defenders);
    ctx.fillStyle = "gold";
    ctx.font = "30px Orbitron";
    ctx.fillText(Math.floor(this.health), this.x + 30, this.y + 500);
    const scaleFactor = 1;
    if (this.choosenDefender === 1) {
      ctx.drawImage(
        defender1,
        this.frameX * this.currentImageWidth,
        this.frameY * this.currentImageHeight,
        this.currentImageWidth,
        this.currentImageHeight,
        this.x,
        this.y,
        this.width * scaleFactor,
        this.width * scaleFactor
      );
    } else if (this.choosenDefender === 2) {
      ctx.drawImage(
        defender2,
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
    if (this.choosenDefender === 3) {
      ctx.drawImage(
        defender3,
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
    if (this.choosenDefender === 4) {
      ctx.drawImage(
        defender4,
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

  update() {
    if (frame % 5 === 0) {
      this.frameX++;

      if (this.frameX >= this.maxFrameX) {
        this.frameX = 0;
      }
    }

    if (this.type !== "Sunflower") {
      if (this.shooting) {
        if (this.timer % 100 === 0) {
          projectiles.push(new Projectile(this.x + 70, this.y + 50));
        }
      }
    } else {
      this.updateSunbeams();
    }
    this.timer++;
  }
}

class Peashooter extends Defenders {
  constructor(x, y, spriteWidth = 100, spriteHeight = 71) {
    super(x, y, "Peashooter");
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.type = "Peashooter";

    this.currentImageWidth = this.spriteHeight;
    this.maxFrameX = 24;
    this.frameX = 0;
  }

  update() {
    super.update();
  }

  draw() {
    super.draw();
  }
}

class Sunbeam {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.width = 70;
    this.height = 70;
    this.image = new Image();
    this.image.src = "./images/interface/Sun.gif";
  }
  update() {}
  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  isMouseOver() {
    return (
      mouse.x >= this.x &&
      mouse.x <= this.x + this.width &&
      mouse.y >= this.y &&
      mouse.y <= this.y + this.height
    );
  }
}

class Sunflower extends Defenders {
  constructor(x, y) {
    super(x, y, "Sunflower");
    this.sunbeamTimer = 0;
    this.sunbeamProductionInterval = 1000;
    this.sunbeamProductionDelay = 500;
    this.isProducingSunbeams = false;
    this.sunbeams = [];
    this.type = "Sunflower";
    this.maxFrameX = 24;
  }

  update() {
    super.update();
  }

  updateSunbeams() {
    this.sunbeamTimer++;

    if (
      !this.isProducingSunbeams &&
      this.sunbeamTimer >= this.sunbeamProductionDelay
    ) {
      this.isProducingSunbeams = true;
      this.sunbeamTimer = 0;
    }

    if (
      this.isProducingSunbeams &&
      this.sunbeamTimer >= this.sunbeamProductionInterval
    ) {
      const newSunbeam = new Sunbeam(
        this.x + this.width / 2,
        this.y - this.height / 2
      );
      this.sunbeams.push(newSunbeam);
      this.sunbeamTimer = 0;
    }

    for (let i = this.sunbeams.length - 1; i >= 0; i--) {
      this.sunbeams[i].update();
      if (this.sunbeams[i].isMouseOver()) {
        numberOfResources += 25;
        this.sunbeams.splice(i, 1);
      }
    }
  }

  draw() {
    super.draw();

    if (this.type === "Sunflower") {
      if (this.sunbeams && this.sunbeams.length > 0) {
        for (const sunbeam of this.sunbeams) {
          sunbeam.draw();
        }
      }
    }
  }
}
function handleDefenders() {
  for (let i = defenders.length - 1; i >= 0; i--) {
    if (defenders[i]) {
      defenders[i].draw();
      defenders[i].update();

      if (defenders[i].type === "Sunflower") {
        defenders[i].updateSunbeams();
      }

      if (enemyPositions.indexOf(defenders[i].y) !== -1) {
        defenders[i].shooting = true;
      } else {
        defenders[i].shooting = false;
      }

      for (let j = 0; j < enemies.length; j++) {
        if (defenders[i] && collision(defenders[i], enemies[j])) {
          enemies[j].movement = 0;
          defenders[i].health -= 0.2;
        }

        if (defenders[i] && defenders[i].health <= 0) {
          defenders.splice(i, 1);
          enemies[j].movement = enemies[j].speed;
        }
      }
    }
  }
}

// For choosing defenders

const card1 = {
  x: 10,
  y: 10,
  width: 90,
  height: 95,
};
const card2 = {
  x: 10,
  y: 120,
  width: 90,
  height: 95,
};
const card3 = {
  x: 10,
  y: 230,
  width: 90,
  height: 95,
};
const card4 = {
  x: 10,
  y: 340,
  width: 90,
  height: 95,
};

function chooseDefender() {
  let card1stroke = "black";
  let card2stroke = "black";
  let card3stroke = "black";
  let card4stroke = "black";
  if (collision(mouse, card1) && mouse.clicked) {
    choosenDefender = 1;
  } else if (collision(mouse, card2) && mouse.clicked) {
    choosenDefender = 2;
  } else if (collision(mouse, card3) && mouse.clicked) {
    choosenDefender = 3;
  } else if (collision(mouse, card4) && mouse.clicked) {
    choosenDefender = 4;
  }
  if (choosenDefender === 1) {
    card1stroke = "gold";
    card2stroke = "black";
  } else if (choosenDefender === 2) {
    card1stroke = "black";
    card2stroke = "gold";
  } else if (choosenDefender === 3) {
    card1stroke = "black";
    card2stroke = "black";
    card3stroke = "gold";
  } else if (choosenDefender === 4) {
    card1stroke = "black";
    card2stroke = "black";
    card3stroke = "black";
    card4stroke = "gold";
  } else {
    card1stroke = "black";
    card2stroke = "black";
  }

  ctx.linewidth = 1;
  ctx.fillStyle = "rgba(255, 255, 255, 1.5)";
  ctx.fillRect(card1.x, card1.y, card1.width, card1.height);
  ctx.strokeStyle = card1stroke;
  ctx.strokeRect(card1.x, card1.y, card1.width, card1.height);
  ctx.drawImage(defender1icon, 0, 0, 194, 194, card1.x, card1.y, 150, 150);
  ctx.fillRect(card2.x, card2.y, card2.width, card2.height);

  ctx.strokeStyle = card2stroke;
  ctx.strokeRect(card2.x, card2.y, card2.width, card2.height);
  ctx.drawImage(defender2icon, 0, 0, 194, 194, card2.x, card2.y, 150, 150);
  ctx.fillRect(card3.x, card3.y, card3.width, card3.height);
  ctx.strokeStyle = card3stroke;
  ctx.strokeRect(card3.x, card3.y, card3.width, card3.height);
  ctx.drawImage(defender3icon, 0, 0, 194, 194, card3.x, card3.y, 150, 150);
  ctx.strokeStyle = card4stroke;
  ctx.strokeRect(card4.x, card4.y, card4.width, card4.height);
  ctx.drawImage(defender4icon, 0, 0, 300, 300, card4.x, card4.y, 300, 300);
}

class CherryBomb extends Defenders {
  constructor(x, y) {
    super(x, y, "CherryBomb");
    this.explosionRadius = 100;
    this.exploded = false;
    this.explosionImage = new Image();
    this.explosionImage.src = "./images/Plants/CherryBomb/Boom.gif";
    this.explosionStartTime = null;
    this.showExplosion = false;
    defenders.push(this);
  }

  checkCollisions() {
    for (let i = enemies.length - 1; i >= 0; i--) {
      const enemy = enemies[i];
      if (collision(this, enemy)) {
        enemies.splice(i, 1);
        score += 10;
        this.exploded = true;
        this.explosionStartTime = Date.now();
        // enemy.movement = 0;
        this.showExplosion = true;
      }
    }
  }

  update() {
    if (!this.exploded) {
      this.checkCollisions();
    }
  }

  draw() {
    if (this.type === "CherryBomb") {
      if (!this.exploded) {
        super.draw();
      } else {
        if (this.showExplosion) {
          const currentTime = Date.now();
          if (currentTime - this.explosionStartTime < 2000) {
            const explosionX = this.x - this.explosionRadius / 2;
            const explosionY = this.y - this.explosionRadius / 2;

            ctx.drawImage(
              this.explosionImage,
              explosionX,
              explosionY,
              this.explosionRadius * 2,
              this.explosionRadius * 2
            );
          }
        }
      }
    }
  }
}
class Walnut extends Defenders {
  constructor(x, y, spriteWidth = 715, spriteHeight = 315) {
    super(x, y, "WalNut");
    this.spriteWidth = spriteWidth;
    this.spriteHeight = spriteHeight;
    this.type = "WalNut";
    this.currentImageWidth = this.spriteWidth / 11;
    this.currentImageHeight = this.spriteHeight / 4.5;
    this.maxFrameX = 11;
    this.frameX = 0;
    this.frameY = 0;
    this.minFrameX = 0;
    this.minFrameY = 0;
    this.health = 300;
    this.maxHealth = this.health;
    this.distracting = false;
  }

  update() {
    if (this.health <= 0) {
      this.distracting = true;
      const index = defenders.indexOf(this);
      if (index !== -1) {
        defenders.splice(index, 1);
      }
    }

    if (frame % 10 === 0) {
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
  }

  draw() {
    super.draw();
  }
}
