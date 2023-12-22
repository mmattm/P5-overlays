let mondrianColors = [];
let myCanvas;

let elementsData = [];

let scratchImages = [];

function preload() {
  elementsData = []; // Clear previous data

  const allElements = Array.from(document.querySelectorAll("img")).filter(
    (img) => {
      return !img.src.toLowerCase().endsWith(".gif");
    }
  );

  allElements.forEach((el) => {
    const rect = el.getBoundingClientRect();

    if (el.height > 200 && el.width > 200) {
      scratchImages.push(
        new ScratchImage(
          rect.left,
          rect.top,
          rect.width,
          rect.height,
          el.src,
          el
        )
      );
    }
  });
  //background(0);
}

function setup() {
  // Create a p5.js canvas
  myCanvas = createCanvas(windowWidth, windowHeight);

  // Set the canvas to a fixed position and give it a z-index
  myCanvas.position(0, 0); // Positions the canvas at the top-left corner
  myCanvas.style("z-index", "10000000000"); // Set z-index to 10 (or any desired value)
  myCanvas.style("position", "fixed"); // Set position to fixed
  //myCanvas.style("pointer-events", "none");

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));

  // exectute function on scroll
  window.addEventListener("scroll", updateElementsData);
}

function updateElementsData() {
  //update scratchImages positions from scroll
  for (let scratchImage of scratchImages) {
    scratchImage.update();
  }
}

function draw() {
  //updateElementsPositions();
  clear();

  for (let scratchImage of scratchImages) {
    scratchImage.display();
  }
  // for (let el of elementsData) {
  //   // fill(random(255), random(255), random(255)); // Random color
  //   fill(255, 0, 0);

  //   //noFill();
  //   //stroke(0);
  //   //strokeWeight(10);
  //   // noStroke();

  //   push();
  //   translate(el.x, el.y);
  //   //rect(0, 0, el.width, el.height);
  //   blur(10);
  //   image(el.img, 0, 0, el.width, el.height);

  //   pop();
  //   // console.log(el);
  //   // let img = loadImage(el.src);
  //   // imgs.push(img);
  // }
}

class ScratchImage {
  constructor(x, y, img_width, img_height, img, el) {
    this.img = loadImage(img);
    this.x = x;
    this.y = y;
    this.width = img_width;
    this.height = img_height;
    this.el = el;
    this.pgraphics = createGraphics(img_width, img_height);
    this.alt = el.alt;
  }

  update() {
    //update position from el
    const rect = this.el.getBoundingClientRect();
    this.x = rect.left;
    this.y = rect.top;
    this.width = rect.width;
    this.height = rect.height;
  }

  display() {
    push();

    // fill(color("rgb(255, 0, 0)"));
    // circle(mouseX, mouseY, 100);

    // fill(255, 0, 0);
    // rect(0, 0, this.width, this.height);
    //fill(255, 0, 0);
    //rect(0, 0, this.width, this.height);

    // this.pgraphics.image(
    //   this.img,
    //   100,
    //   0,
    //   this.pgraphics.width,
    //   this.pgraphics.height
    // );

    // this.pgraphics.fill(255, 0, 0);
    // this.pgraphics.rect(0, 0, this.pgraphics.width, this.pgraphics.height);

    // translate(this.x, this.y);
    //console.log(this.pgraphics);

    /*
    if (this.pgraphics.width > 0) {
      this.pgraphics.clear();
      this.pgraphics.fill(color("rgb(255, 0, 0)"));
      this.pgraphics.circle(mouseX, mouseY, 100);

      push();
      translate(this.x, this.y);

      this.img.mask(this.pgraphics);

      image(this.img, 100, 0, this.width, this.height);
      pop();

      //image(this.pgraphics, 0, 0, this.width, this.height);
    }
    */

    fill(255, 0, 0);
    translate(this.x, this.y);
    rect(0, 0, this.width, this.height);

    image(this.img, 0, 0, this.width / 2, this.height / 2);

    textAlign(CENTER, CENTER);
    text(this.alt, 0, 0);
    pop();
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateElementsData();
}
