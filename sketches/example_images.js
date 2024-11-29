let mondrianColors = [];

let img;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);
  imageMode(CENTER);
}

function draw() {
  if (mouseIsPressed && images.length > 0) {
    image(img, mouseX, mouseY);
  }
}

function mousePressed() {
  img = loadImage(random(images));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
