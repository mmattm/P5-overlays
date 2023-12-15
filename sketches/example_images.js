let mondrianColors = [];
let myCanvas;

let img;

function setup() {
  // Create a p5.js canvas
  myCanvas = createCanvas(windowWidth, windowHeight);

  // Set the canvas to a fixed position and give it a z-index
  myCanvas.position(0, 0);
  myCanvas.style("z-index", "10000000000"); // Set z-index to 10 (or any desired value)
  myCanvas.style("position", "fixed"); // Set position to fixed
  myCanvas.style("pointer-events", "none");

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));
  imageMode(CENTER);
  //console.log(pageImages);

  //img = loadImage(random(pageImages));
}

function draw() {
  if (mouseIsPressed && images.length > 0) {
    //console.log(pageImages[0]);
    image(img, mouseX, mouseY);
  }
}

function mousePressed() {
  img = loadImage(random(images));
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
