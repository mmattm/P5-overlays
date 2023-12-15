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
}

function draw() {
  // get scroll position on page
  let scrollY = window.scrollY;

  // get total page height
  let pageHeight = document.body.scrollHeight;

  let scrollValue = map(scrollY, 0, pageHeight, 0, 255);

  clear();
  background(0, 0, 0, scrollValue);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
