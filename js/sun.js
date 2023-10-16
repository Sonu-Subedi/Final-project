class Sunray {
  constructor(x, speed) {
    this.x = x + 260;
    this.y = -50;
    this.speed = speed;
    this.image = new Image();
    this.image.src = "./images/interface/Sun.gif";
    this.width = 70;
    this.height = 70;
  }

  update() {
    this.y += this.speed;
  }

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

const sunrays = [];
let lastSunrayTime = 0;

function handleSunrays() {
  for (let i = sunrays.length - 1; i >= 0; i--) {
    sunrays[i].update();
    sunrays[i].draw();

    if (sunrays[i].isMouseOver()) {
      numberOfResources += 25;
      sunrays.splice(i, 1);
    } else if (sunrays[i].y >= canvas.height) {
      sunrays.splice(i, 1);
    }
  }

  // Add new sunray at a certain interval
  if (frame % 500 === 0) {
    const randomX = Math.random() * (canvas.width - 70);
    const speed = 1 + Math.random() * 1;
    const newSunray = new Sunray(randomX, speed);
    sunrays.push(newSunray);
  }
}
