let mondrianColors = [];
let myCanvas;

let randomCount = 60;
let count = 0;

let colors;

function setup() {
  // Waiting for font to load
  delay(1000);

  myCanvas = createCanvas(windowWidth, windowHeight);

  // Set the canvas to a fixed position and give it a z-index
  myCanvas.position(0, 0);
  myCanvas.style("z-index", "10000000000"); // Set z-index to 10 (or any desired value)
  myCanvas.style("position", "fixed"); // Set position to fixed
  myCanvas.style("pointer-events", "none");

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));

  colors = [
    color(255, 0, 0), // Red
    color(0, 0, 255), // Blue
    color(255, 255, 0), // Yellow
    color(0), // Black
    color(255), // White
    color(128), // Gray
  ];
  //Charger la font google dans styles.css
  // https://fonts.google.com/specimen/Rubik+Bubbles
  textFont("Rubik Bubbles");
}

function draw() {
  // random title show in center of canvas
  //random every n frames with modulo
  if (count >= randomCount) {
    count = 0;
    randomCount = random(100, 200);
    //clear();
    textSize(random(50, 250));
    textAlign(CENTER, CENTER);
    fill(random(colors));
    translate(width / 2, height / 2);
    rotate(random(-0.5, 0.5));
    text(random(headlines), 0, 0);
  } else {
    count++;
  }
}

function mousePressed() {
  clear();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
