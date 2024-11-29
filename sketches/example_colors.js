let mondrianColors = [];
let canvas;
let blendModes = ["difference", "exclusion", "multiply", "normal"];
let blendCount = 0;

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);

  mondrianColors = [
    color(255, 0, 0), // Red
    color(0, 0, 255), // Blue
    color(255, 255, 0), // Yellow
    color(0), // Black
    color(255), // White
    color(128), // Gray
    // Variations of primary colors
    color(200, 0, 0), // Darker Red
    color(0, 0, 200), // Darker Blue
    color(255, 255, 100), // Lighter Yellow
  ];

  // add mix blend mode difference to canvas defaulCanvas0
  canvas.style("mix-blend-mode", blendModes[0]);

  // Initial calculation
  updateElementsData();

  // Update positions on scroll
  window.addEventListener("scroll", updateElementsData);

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));
}

function updateElementsData() {
  elementsData = []; // Clear previous data

  const allElements = document.querySelectorAll(
    "*:not(html):not(body):not(canvas):not(body > *):not(div.container)"
  );

  allElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    elementsData.push({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height,
    });
  });

  //background(0);
  canvas.clear();
  // background(0);
  blendMode(DIFFERENCE);
  for (let el of elementsData) {
    fill(random(mondrianColors));
    noStroke();
    rect(el.x, el.y, el.width, el.height);
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateElementsData();
}

function mousePressed() {
  blendCount++;
  canvas.style("mix-blend-mode", blendModes[blendCount % blendModes.length]);
}
