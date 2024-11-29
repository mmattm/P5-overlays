let mondrianColors = [];
let canvas;
let blendModes = ["difference", "exclusion", "multiply", "normal"];
let blendCount = 0;
let elementsData = [];
let currentIndex = 0; // Index to keep track of the next element to fill

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

  // Add mix-blend mode difference to canvas defaultCanvas0
  canvas.style("mix-blend-mode", blendModes[0]);

  // Initial calculation
  updateElementsData();

  // Update positions on scroll
  window.addEventListener("scroll", updateElementsData);

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));

  // Start progressively filling
  setInterval(progressiveFill, 20); // Adjust interval for speed
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

  canvas.clear();
  currentIndex = 0; // Reset the index for progressive filling
}

function progressiveFill() {
  if (currentIndex < elementsData.length) {
    const el = elementsData[currentIndex];
    fill(random(mondrianColors));
    noStroke();
    rect(el.x, el.y, el.width, el.height);
    currentIndex++;
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
