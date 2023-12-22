let myCanvas;
let img;

let flashlight = true;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);

  // Set the canvas to a fixed position and give it a z-index
  myCanvas.position(0, 0);
  myCanvas.style("z-index", "10000000000"); // Set z-index to 10 (or any desired value)
  myCanvas.style("position", "fixed"); // Set position to fixed
  myCanvas.style("pointer-events", "none");

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));

  img = loadImage(random(images));
}

function draw() {
  // get scroll position on page
  clear();

  if (flashlight) {
    background(0, 0, 0, 100);
    drawingContext.save(); // Save before clipping mask so you can undo it later on. ALWAYS DO THIS BEFORE TRANSLATIONS.
    noStroke();
    circle(mouseX, mouseY, 360 + sin(frameCount * 0.01) * 60);
    drawingContext.clip();
    clear();

    push();
    fill(255, 0, 0);
    // Rajouter les éléments grahique ici

    circle(width / 2, height / 2, 360 + sin(frameCount * 0.01) * 60);

    pop();
    //image(img, 0, 0, width, height);

    drawingContext.restore(); // Remove the clippping mask and go back to normal.
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  flashlight = !flashlight;
}
