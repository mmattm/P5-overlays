function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);

  textFont("IBM Plex Mono");
}

function draw() {
  clear();

  push();
  translate(mouseX, mouseY);
  textSize(64);
  textAlign(CENTER, CENTER);
  fill(0, 0, 0);
  rotate(sin(frameCount / 100) * 0.25);
  //text("Hello World!", 0, 0);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
