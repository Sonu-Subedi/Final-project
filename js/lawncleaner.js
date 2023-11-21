class LawnCleaner {
  constructor(y) {
    this.x = 300;
    this.y = y;
    this.width = 70;
    this.height = 70;
    this.image = new Image();
    this.image.src = "./images/interface/LawnCleaner.png";
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }

  update() {
    if (this.cleaning) {
      this.x += this.increment;
    }

    for (const enemy of enemies) {
      if (!this.cleaning && collision(this, enemy)) {
        this.cleaning = true;
        this.increment = 10;

        // Clear all enemies in the same row
        for (const otherEnemy of enemies) {
          if (otherEnemy !== enemy && otherEnemy.y === enemy.y) {
            otherEnemy.delete = true;
          }
        }
      } else if (this.cleaning && collision(this, enemy)) {
        enemy.delete = true;
      }
    }

    // Remove all enemies marked for deletion
    enemies = enemies.filter((enemy) => !enemy.delete);

    if (this.x > canvas.width) {
      this.delete = true;
    }

    this.draw();
  }

  draw() {
    ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
  }
}

// Create LawnCleaner instances for each row
const lawnCleaners = [];
const rowPositions = [290, 440, 610];

for (const y of rowPositions) {
  const newLawnCleaner = new LawnCleaner(y);
  lawnCleaners.push(newLawnCleaner);
}
