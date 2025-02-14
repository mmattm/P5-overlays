let weight = 100;
let customFont;
let rubbans = []; // Array to hold multiple ribbon objects
let numRubbans = 3; // Number of ribbons to create
let rubbanDistance = 100;

let palette_1 = ["#FFC312", "#C4E538", "#12CBC4", "#FDA7DF", "#ED4C67"];
let palette_2 = ["#D980FA", "#9980FA", "#5758BB", "#ED4C67", "#B53471"];
let palette_3 = ["#12CBC4", "#1289A7", "#D980FA", "#B53471", "#FDA7DF"];

let palettes = [palette_1, palette_2, palette_3];

let fonts = ["assets/poppins.ttf"];

let random_palette;

function preload() {
  const fontURL = chrome.runtime.getURL(random(fonts));
  customFont = loadFont(fontURL);
  loadUtils();
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setupCanvas(canvas);

  textFont(customFont);

  console.log(metadatas.comments);

  random_palette = random(palettes);

  const urlPattern =
    /https?:\/\/[^\s]+|www\.[^\s]+|(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}/;

  // Filter comments and clean up "//" at the beginning
  const filteredComments = metadatas.comments
    .filter((comment) => !urlPattern.test(comment.content))
    .map((comment) => ({
      ...comment,
      content: comment.content.replace(/^\/\//, ""), // Remove "//" at the beginning
    }));

  console.log(filteredComments);

  let count = 0;
  filteredComments.forEach((comment) => {
    if (rubbans.length < 100) {
      // For each rubban, we can vary its vertical position or angle
      // Here we just shift them vertically by i * someSpacing for demonstration

      let startX = random(-100, 100);
      let endX = random(width * 0.75, width * 1.25);

      let startY = random(height); // shift each ribbon down by 150 pixels
      let endY = random(startY - 200, startY + 200);
      //let endY = startY;
      // let r = random(0, 250);
      // let g = random(0, 100);
      // let b = random(0, 205);
      // let colorrr = color(r, g, b);

      let colorrr = random(random_palette);

      rubbans.push(
        new Rubban(startX, startY, endX, endY, weight, colorrr, comment, count)
      );

      count++;
    }
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

  let currentLine = Math.floor(
    (Math.min(scrollY, pageHeight - window.innerHeight) /
      (pageHeight - window.innerHeight)) *
      linesLength
  );
  // Display all rubbans

  for (let rubban of rubbans) {
    if ((rubban.id = 5)) {
      console.log("current line: " + currentLine);
      console.log("comment line: " + rubban.comment.line);
    }

    if (
      currentLine >= rubban.comment.line - rubbanDistance * 0.5 &&
      currentLine <= rubban.comment.line + rubbanDistance * 1.5
    ) {
      rubban.animated = true;
    } else {
      rubban.animated = false;
    }
    rubban.display(currentLine);
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
  constructor(x, y, x2, y2, ribbonWeight, ribbonColor, comment, id) {
    this.x = x;
    this.y = y;
    this.x2 = x2;
    this.y2 = y2;
    this.ribbonWeight = ribbonWeight;
    this.ribbonColor = ribbonColor;
    this.animated = false;
    this.comment = comment;
    this.id = id;
    this.z = random(-100, 200);

    // Compute the angle based on start and end points
    this.angle = atan((this.y2 - this.y) / windowWidth);
    this.progress = 0;

    // random angle
    // this.angle = random(0, PI);
  }

  display(currentLine) {
    let a = 0;

    //if (this.animated) this.progress++;
    // Compute dynamic values

    if (this.animated) {
      a = map(
        sin((PI * (currentLine - this.comment.line)) / rubbanDistance),
        -1,
        1,
        0,
        windowWidth
      ); // Movement along the ribbon
    }

    // if (this.id == 5) console.log(a);

    let e = map(a, 0, windowWidth, this.ribbonWeight / 4, 0); // Thickness of the roller

    rectMode(CENTER);
    noStroke();

    push();
    // Move to the midpoint between the start and end points
    translate(windowWidth / 2, this.y2 - (this.y2 - this.y) / 2, 0);
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
    if (lightness(this.ribbonColor) >= 75) {
      fill(0);
    } else {
      fill(255);
    }

    textSize(64);
    textAlign(LEFT, CENTER);
    text(this.comment.content, -width / 2 + 20, -10);
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
