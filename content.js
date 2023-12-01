console.log("p5 loaded");

// Select all div elements on the page
const divs = document.querySelectorAll("div");

let elementsData = [];
let myCanvas;

let mondrianColors = [];

function setup() {
  // Create a p5.js canvas
  myCanvas = createCanvas(windowWidth, windowHeight);

  // Set the canvas to a fixed position and give it a z-index
  myCanvas.position(0, 0); // Positions the canvas at the top-left corner
  myCanvas.style("z-index", "10000000000"); // Set z-index to 10 (or any desired value)
  myCanvas.style("position", "fixed"); // Set position to fixed

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

  // move a div to body

  //   originParent.position(0, 0); // Positions the canvas at the top-left corner
  //   originParent.style("z-index", "1000000"); // Set z-index to 10 (or any desired value)
  //   originParent.style("position", "fixed"); // Set position to fixed

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
  myCanvas.clear();
  background(0);

  for (let el of elementsData) {
    // fill(random(255), random(255), random(255)); // Random color
    fill(random(mondrianColors));
    //noFill();
    //stroke(0);
    //strokeWeight(10);
    noStroke();
    rect(el.x, el.y, el.width, el.height);
  }

  //redraw(); // Redraw with updated positions
}

function draw() {
  //   background(255);
  //   for (let el of elementsData) {
  //     fill(random(255), random(255), random(255)); // Random color
  //     rect(el.x, el.y, el.width, el.height);
  //   }
}
