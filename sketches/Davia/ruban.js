let weight = 100;
let customFont;
let rubbans = []; // Array to hold multiple ribbon objects
let numRubbans = 3; // Number of ribbons to create

let mondrianColor = ["#FFC300", "#FF5733", "#DAF7A6", "#C70039", "#900C3F"];

function preload() {
  const fontURL = chrome.runtime.getURL("assets/poppins.ttf");
  customFont = loadFont(fontURL);
  loadUtils();
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setupCanvas(canvas);

  textFont(customFont);

  console.log(metadatas);

  metadatas.comments.forEach((comment) => {
    if (rubbans.length < 5) {
      // For each rubban, we can vary its vertical position or angle
      // Here we just shift them vertically by i * someSpacing for demonstration
      let startX = random(-100, 100);
      let startY = random(height); // shift each ribbon down by 150 pixels
      let endX = random(width * 0.75, width * 1.25);
      let endY = random(height);

      rubbans.push(
        new Rubban(
          startX,
          startY,
          endX,
          endY,
          weight,
          random(mondrianColor),
          comment
        )
      );
    }

    // ribbons.push({
    //   active: false,
    //   comment: comment,
    //   line: comment.line,
    //   py_1: random(height),
    //   py_2: random(height),
    // });
  });

  // Create multiple Rubban objects
  for (let i = 0; i < numRubbans; i++) {
    // // For each rubban, we can vary its vertical position or angle
    // // Here we just shift them vertically by i * someSpacing for demonstration
    // let startX = random(-100, 100);
    // let startY = random(height); // shift each ribbon down by 150 pixels
    // let endX = random(width * 0.75, width * 1.25);
    // let endY = random(height);
    // let ribbonText = "This text is masked within the ribbon width! " + i;
    // rubbans.push(
    //   new Rubban(
    //     startX,
    //     startY,
    //     endX,
    //     endY,
    //     weight,
    //     ribbonText,
    //     random(mondrianColor)
    //   )
    // );
  }
}

function draw() {
  clear();
  translate(-windowWidth / 2, -windowHeight / 2);
  lights();

  // get scroll position on page
  let scrollY = window.scrollY;

  // get total page height
  let pageHeight = document.body.scrollHeight;

  // get the number of lines in the HTML content
  let htmlContent = document.documentElement.outerHTML;
  let lines = htmlContent.split(/\r?\n/);
  let linesLength = lines.length;

  let currentLine = Math.floor((scrollY / pageHeight) * linesLength);

  // Display all rubbans
  for (let rubban of rubbans) {
    rubban.display();

    if (currentLine >= rubban.comment.line) {
      rubban.animated = true;
    }
  }

  //   metadatas.comments.forEach((comment) => {
  //     if (currentLine >= comment.line) {
  //       // find the corresponding ribbon and set it to active
  //       ribbons.forEach((ribbon) => {
  //         if (ribbon.line === comment.line) {
  //           ribbon.active = true;
  //         }
  //       });
  //       //console.log("Passed comment at line", comment.line, ":", comment.content);
  //     }
  //   });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// The Rubban class
class Rubban {
  constructor(x, y, x2, y2, ribbonWeight, ribbonColor, comment) {
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.ribbonWeight = ribbonWeight;
    this.ribbonColor = ribbonColor;
    this.animated = false;
    this.comment = comment;

    // Compute the angle based on start and end points
    this.angle = atan((this.y2 - this.y) / windowWidth);
    this.progress = 0;

    // random angle
    // this.angle = random(0, PI);
  }

  display() {
    if (this.animated) this.progress++;
    // Compute dynamic values
    let a = map(sin(this.progress * 0.01), -1, 1, 0, windowWidth); // Movement along the ribbon
    let e = map(a, 0, windowWidth, this.ribbonWeight / 4, 0); // Thickness of the roller

    rectMode(CENTER);
    noStroke();

    push();
    // Move to the midpoint between the start and end points
    translate(windowWidth / 2, this.y2 - (this.y2 - this.y) / 2);
    rotate(this.angle);

    // Draw the roller (cylinder)
    push();
    fill("white");
    translate(a - windowWidth / 2, 0, e);
    cylinder(e, this.ribbonWeight);
    pop();

    // Draw the ribbon (plane)
    push();
    fill(this.ribbonColor);
    rectMode(CORNER);

    // The ribbon extends from -(windowWidth - a)/2 to +a/2 relative to the midpoint
    push();
    translate(-(windowWidth - a) / 2, 0);
    plane(a, this.ribbonWeight);
    pop();

    // Begin clipping region
    beginClip();
    push();
    translate(-(windowWidth - a) / 2, 0);
    plane(a, this.ribbonWeight);
    pop();
    endClip();

    // Draw the text masked by the ribbon
    push();
    fill(0);
    textSize(64);
    textAlign(LEFT, CENTER);
    text(this.comment.content, -width / 2 + 20, 0);
    pop();

    pop();
    pop();
  }
}

// If you're using clipping, define beginClip() and endClip() as needed.
// Example (using p5.Graphics for masking - adjust as needed):
function beginClip() {
  // Implement your clipping start code here if using a custom masking strategy
}

function endClip() {
  // Implement your clipping end code here
}
