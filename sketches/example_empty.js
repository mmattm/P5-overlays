function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);
  console.log(metadatas);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
