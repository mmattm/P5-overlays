let c02;

let c02Value = 0;

let rasters = [];

async function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setupCanvas(canvas);
  c02 = await calculatePageSizeAndCO2();

  console.log("DEBUG:");
  console.log(c02);

  // scrollevent
  window.addEventListener("scroll", scrollEvent);

  // textFont("IBM Plex Mono");

  // Load all images from the page
  const htmlImages = document.querySelectorAll("img"); // Select all <img> elements from the page

  // divide by image number
  const c02PerImage = c02.pageSize.images / htmlImages.length;
  console.log("c02 per image: ", c02PerImage);

  for (let img of htmlImages) {
    // Load the image with p5.js
    let p5Image = await loadImagePromise(img.src);

    // Get the image's position and size on the page
    const rect = img.getBoundingClientRect();
    const raster = new Raster(p5Image, rect.x, rect.y, rect.width, rect.height);

    // Add the raster to the array
    rasters.push(raster);

    c02Value += c02PerImage;
  }

  console.log("finished loading images");
}

function draw() {
  background(0, 0, 255);
  //clear();
  //translate(-width / 2, -height / 2);

  // Display all rasters
  for (let raster of rasters) {
    raster.display();
  }
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

      // Translate and rotate the 3D object
      translate(this.x - width / 2, this.y - height / 2, 100); // Center the object in the 3D space
      //rotateX(frameCount * 0.01); // Example rotation along X-axis
      //rotateY(frameCount * 0.01); // Example rotation along Y-axis

      // Define a textured 3D quadrilateral

      beginShape();
      vertex(i * 100, 0, 1, 0, 0); // Top-left corner
      vertex(this.w, 0, 1 + abs(sin(frameCount * 0.01 * i) * 10 * i), 1, 0); // Top-right corner (with depth)
      vertex(this.w, this.h, 1, 1, 1); // Bottom-right corner
      vertex(0, this.h, 1 + abs(cos(frameCount * 0.005 * i) * 10 * i), 0, 1); // Bottom-left corner (with depth)
      endShape();

      pop();
    }

    // show the CO2 impact
    // push();
    // fill(0);
    // textFont("IBM Plex Mono");
    // textSize(128);
    // text(
    //   `CO2: ${c02Value.toFixed(2)} kg`,
    //   this.x - width / 2,
    //   this.y - height / 2
    // );
    // pop();
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
