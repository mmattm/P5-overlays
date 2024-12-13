function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);

  console.log("DEBUG:");
  console.log(metadatas.hiddenElements[0]);
}

function draw() {
  clear();

  // push();
  // translate(mouseX, mouseY);
  // textSize(64);
  // textAlign(CENTER, CENTER);
  // fill(0, 0, 0);
  // rotate(sin(frameCount / 100) * 0.25);
  // text("Hello World!", 0, 0);
  // pop();

  for (let el of metadatas.hiddenElements) {
    push();
    translate(el.coordinates.x, el.coordinates.y);
    fill(255);
    noStroke();
    textSize(128);
    //rect(0, 0, el.width, el.height);
    text("👻", 0, 0);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
