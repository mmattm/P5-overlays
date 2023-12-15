let myCanvas;

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
  clear();

  push();
  translate(mouseX, mouseY);
  textSize(128);
  textAlign(CENTER, CENTER);
  fill(255, 0, 0);
  rotate(sin(frameCount / 100) * 2);
  text("Hello World!", 0, 0);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
