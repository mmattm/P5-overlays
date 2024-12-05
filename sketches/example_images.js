let img;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);
  imageMode(CENTER);
}

function draw() {
  if (mouseIsPressed && img) {
    // Resize images trop grandes
    const scaleFactor = max(img.width / (width / 2), img.height / height, 1);

    const displayWidth = (img.width / scaleFactor) * sin(frameCount / 100);
    const displayHeight = (img.height / scaleFactor) * sin(frameCount / 100);

    image(img, mouseX, mouseY, displayWidth, displayHeight);
    filter(INVERT);
  }
}

function mousePressed() {
  if (metadatas.images.length > 0) {
    let random_img = random(metadatas.images);
    img = loadImage(random_img.src);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  // if delete key is pressed clear the canvas
  if (keyCode === DELETE || keyCode === BACKSPACE) {
    clear();
  }
}
