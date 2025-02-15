let c02;

let c02Value = 0;

let rasters = [];

let overlayDiv;
// let overlayCanvas;
// let overlayGraphics;

async function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setupCanvas(canvas);

  // Overlay 2D canvas
  overlayCanvas = createCanvas(windowWidth, windowHeight); // 2D canvas
  overlayCanvas.style("pointer-events", "none"); // Ensure it doesn't block interactions with the WEBGL canvas

  // Optionally, use createGraphics for more flexible overlay
  // overlayGraphics = createGraphics(windowWidth, windowHeight);

  c02 = await calculatePageSizeAndCO2();

  console.log("DEBUG:");
  console.log(c02);

  // scrollevent
  window.addEventListener("scroll", scrollEvent);

  // textFont("IBM Plex Mono");

  // Load all images from the page
  const htmlImages = document.querySelectorAll("img"); // Select all <img> elements from the page
  // const htmlImages = metadatas.images;

  //console.log("htmlImages: ", htmlImages);

  // divide by image number
  const c02PerImage = c02.pageSize.images / htmlImages.length;
  console.log("c02 per image: ", c02PerImage);

  for (let img of htmlImages) {
    // Load the image with p5.js

    //if image width smaller than 100px return
    if (img.width < 100) {
      console.log(`Skipping image with width ${img.width}px`);
      continue; // Skip to the next image
    }

    let p5Image = await loadImagePromise(img.src);

    // Get the image's position and size on the page
    const rect = img.getBoundingClientRect();
    const raster = new Raster(p5Image, rect.x, rect.y, rect.width, rect.height);

    // Add the raster to the array
    rasters.push(raster);

    c02Value += c02PerImage;
  }

  console.log("finished loading images");
  console.log("rasters: ", rasters);

  overlayDiv = createDiv();
  overlayDiv.id("overlay-text");
  overlayDiv.style("position", "fixed");
  overlayDiv.style("top", "50%");
  overlayDiv.style("left", "50%");
  overlayDiv.style("transform", "translate(-50%, -50%)");
  overlayDiv.style("font-family", "sans-serif");
  overlayDiv.style("font-size", "128px");
  overlayDiv.style("mix-blend-mode", "multiply");
  overlayDiv.style("background", "black");
  overlayDiv.style("color", "white");
  overlayDiv.style("text-align", "center");
  // overlayDiv.style("pointer-events", "none"); // Ensure it doesn't block interactions with the canvas
}

function draw() {
  //background(0, 0, 255);
  clear();
  //translate(-width / 2, -height / 2);

  // Display all rasters
  for (let raster of rasters) {
    raster.display();
  }

  // // Clear the overlay canvas and draw additional elements
  // overlayGraphics.clear();
  // overlayGraphics.textFont("IBM Plex Mono");
  // overlayGraphics.fill(255, 0, 0);
  // overlayGraphics.textSize(100);
  // overlayGraphics.textAlign(CENTER, CENTER);
  // overlayGraphics.text(
  //   `C02: ${c02Value.toFixed(2)} g`,
  //   overlayGraphics.width / 2,
  //   overlayGraphics.height / 2
  // );

  // // Display the overlay graphics
  // image(overlayGraphics, -width / 2, -height / 2);
  // Create the overlay HTML element

  if (overlayDiv) overlayDiv.html(`${c02Value.toFixed(2)} g`);
}

// Raster class definition
class Raster {
  constructor(img, x, y, w, h) {
    this.img = img; // P5.js image
    this.x = x; // X coordinate
    this.y = y; // Y coordinate
    this.w = w; // Width
    this.h = h; // Height
    // calculate based on image size
    this.c02 = this.w * this.h * 0.0000001;

    this.randomMode = Math.round(Math.random() * 3); // Random mode between 0 and 3

    console.log("c02: ", this.c02);
    console.log("mode", this.randomMode);
  }

  display() {
    noStroke();

    push();
    translate(this.x - width / 2, this.y - height / 2, 0);
    fill(255);
    rect(0, 0, this.w, this.h);
    pop();

    let numberOfSlices = floor(this.c02 * 1000);
    for (let i = 0; i < numberOfSlices; i++) {
      push();
      noStroke();

      // Set texture mode
      textureMode(NORMAL);

      // Apply the image as a texture
      texture(this.img);

      textureWrap(MIRROR, REPEAT); // Repeat the texture if the quadrilateral is larger than the image

      // switch (this.randomMode) {
      //   case 0:
      //     fill(255, 0, 0);
      //     break;
      //   case 1:
      //     fill(0, 0, 255);
      //     break;
      //   case 2:
      //     fill(0, 255, 0);
      //     break;
      //   case 3:
      //     fill(255, 0, 0);
      //     break;
      // }
      // Translate and rotate the 3D object
      translate(this.x - width / 2, this.y - height / 2, 1);

      let amplitude = sin(frameCount * 0.001) * 100;

      beginShape();
      vertex(0, 0, 1, 0, 0); // Top-left corner
      vertex(
        this.w,
        0,
        0 +
          map(
            sin(frameCount * 0.001) * amplitude * i,
            -amplitude * i,
            amplitude * i,
            0,
            amplitude * i
          ),
        1,
        0
      ); // Top-right corner (with depth)
      vertex(this.w, this.h, 1, 1, 1); // Bottom-right corner
      vertex(0, this.h, 1, 0, 1); // Bottom-left corner (with depth)
      endShape();

      pop();
    }
  }
}

// Helper function to load images as promises
function loadImagePromise(src) {
  return new Promise((resolve, reject) => {
    loadImage(src, resolve, reject);
  });
}

function scrollEvent() {
  // replace rasters position
  const htmlImages = document.querySelectorAll("img"); // Select all <img> elements from the page

  // Update each raster's position based on its corresponding image
  for (let i = 0; i < rasters.length; i++) {
    const rect = htmlImages[i].getBoundingClientRect(); // Get the new bounding rectangle of the image
    rasters[i].x = rect.x; // Update x position
    rasters[i].y = rect.y; // Update y position
    rasters[i].w = rect.width; // Update width
    rasters[i].h = rect.height; // Update height
  }
}

function windowResized() {
  scrollEvent(), resizeCanvas(windowWidth, windowHeight);
}
