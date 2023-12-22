let myCanvas;

// get all image in main id div
let whatsAppImages = [];

let icons = [];

function preload() {
  let intervalId = setInterval(function () {
    // Select all images within the #main div
    let imgs = document.querySelectorAll("#main img");

    // If any images are found, clear the interval
    if (imgs.length > 0) {
      clearInterval(intervalId);
      for (let img of imgs) {
        whatsAppImages.push(loadImage(img.src));
      }

      for (let img of whatsAppImages) {
        icons.push(new Icon(img));
      }
      console.log("Images found, interval cleared.");
    }
  }, 1000);
}

let pg;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);

  // Set the canvas to a fixed position and give it a z-index
  myCanvas.position(0, 0);
  myCanvas.style("z-index", "10000000000"); // Set z-index to 10 (or any desired value)
  myCanvas.style("position", "fixed"); // Set position to fixed
  myCanvas.style("pointer-events", "none");

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));

  textFont("DM Serif Display");
}

function draw() {
  //clear();

  console.log(whatsAppImages);

  for (let icon of icons) {
    icon.update();
    icon.display();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Icon {
  constructor(img) {
    this.position = new createVector(width / 2, height / 2);
    this.velocity = new createVector(random(-2, 2), random(-2, 2));
    this.rotateSpeed = random(-0.01, 0.01);
    this.img = img;
  }

  update() {
    // Add the current speed to the position.
    this.position.add(this.velocity);

    if (this.position.x > width || this.position.x < 0) {
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.position.y > height || this.position.y < 0) {
      this.velocity.y = this.velocity.y * -1;
    }
  }
  display() {
    push();
    imageMode(CENTER);
    translate(this.position.x, this.position.y);
    rotate(frameCount * this.rotateSpeed);
    // Display circle at x position
    if (this.img.width > 800) scale(0.25);
    image(this.img, 0, 0, this.img.width, this.img.height);
    pop();
  }
}

function mousePressed() {
  clear();
}
