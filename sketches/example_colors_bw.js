let mondrianColors = [];
let canvas;
let blendModes = ["difference", "exclusion", "multiply", "normal"];
let blendCount = 0;
let elementsData = [];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setupCanvas(canvas);

  mondrianColors = [
    color(255), // Red
    color(0, 0, 255), // Blue
  ];

  // add mix blend mode difference to canvas defaulCanvas0
  //canvas.style("mix-blend-mode", blendModes[0]);

  // Initial calculation
  updateElementsData();

  // Update positions on scroll
  window.addEventListener("scroll", updateElementsData);

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));
}

function updateElementsData() {
  elementsData = []; // Clear previous data

  // const allElements = document.querySelectorAll(
  //   "*:not(html):not(body):not(canvas):not(body > *):not(div.container)"
  // );

  // get all images
  const allElements = document.querySelectorAll("img");

  // Simplified forEach to directly push data
  allElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    elementsData.push({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });
  });
}

function draw() {
  //background(0);
  canvas.clear();
  translate(-width / 2, -height / 2);
  // background(0);
  blendMode(DIFFERENCE);

  for (let el of elementsData) {
    push();
    translate(el.x, el.y);
    fill(255);
    noStroke();
    rect(0, 0, el.width, el.height);
    pop();
  }

  for (let el of elementsData) {
    push();
    translate(el.x, el.y);
    rotateY(frameCount * 0.01);
    fill(0);
    noStroke();
    rect(0, 0, el.width, el.height);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateElementsData();
}

function mousePressed() {
  blendCount++;
  //canvas.style("mix-blend-mode", blendModes[blendCount % blendModes.length]);
}
