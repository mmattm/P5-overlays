let customFramecount = 0;
let stripes = []; // Will hold our Stripe objects
let img;
let canvas;

let mondrianColors = ["#D40920", "#1356A2", "#F4E23D"];

async function setup() {
  const captureArea = document.body;

  await html2canvas(captureArea, {
    width: window.innerWidth,
    height: window.innerHeight,
  }).then((canvas) => {
    const screenshot = canvas.toDataURL("image/png");
    img = loadImage(screenshot, () => {
      console.log("Image loaded successfully.");
      initializeStripes(); // Initialize stripes after image is loaded
      startAnimation();
    });
  });

  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);

  textFont("IBM Plex Mono");
}

// Initialize the stripes based on metadatas.ads array
function initializeStripes() {
  // Number of stripes based on metadatas.ads length
  const stripeCount = metadatas.ads.ads.length;

  // Generate random values for each stripe
  let randomValues = [];
  for (let i = 0; i < stripeCount; i++) {
    randomValues.push(random(0.1, 2)); // arbitrary random range
  }

  // Sum the random values
  let totalRandom = randomValues.reduce((acc, val) => acc + val, 0);

  // Create stripes with normalized widths
  let currentX = 0;
  for (let i = 0; i < stripeCount; i++) {
    let w = (randomValues[i] / totalRandom) * width;
    let stripe = new Stripe(
      i,
      currentX,
      w,
      metadatas.ads.ads[i],
      random(mondrianColors)
    );
    stripes.push(stripe);
    currentX += w;
  }
}

function customDraw() {
  customFramecount++;
  clear();

  fill(0);
  rect(0, 0, width, height);

  if (!img) {
    console.log("Waiting for image to load...");
    requestAnimationFrame(customDraw);
    return;
  }

  // Draw each stripe
  for (let stripe of stripes) {
    //stripe.checkHover(mouseX, mouseY);
    stripe.draw();
  }

  // Request the next frame
  requestAnimationFrame(customDraw);
}

function startAnimation() {
  customDraw();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

// Stripe class definition
class Stripe {
  constructor(index, x, w, ad, color) {
    this.index = index;
    this.x = x; // Position on canvas
    this.w = w; // Width on canvas
    this.animationSpeed = 0.005;
    this.amplitude = 100 * pixelDensity();
    this.hovered = false; // Initially not hovered
    this.ad = ad;
    this.color = color;
  }

  // Checks whether the mouse is currently over this stripe
  checkHover(mx, my) {
    // If mouseX and mouseY lie within the boundaries of the stripe

    if (mx >= this.x && mx <= this.x + this.w && my >= 0 && my <= height) {
      if (this.hovered) {
        this.hovered = false;
      } else {
        this.hovered = true;
      }
    } else {
      this.hovered = false;
    }
  }

  draw() {
    // Calculate image portion
    // We need to map stripe's canvas width back to image coordinates
    // total strips = sum of widths = img.width basically we sample from the image width
    // We will partition the image width equally by number of stripes?
    // Or we can just consider each stripe as a portion of the total image width.
    // If we want each stripe to represent equal fraction of the image, we can do:
    // But the original code took stripes from the image in equal widths.
    // Let's follow the original logic:
    // In original code: stripeWidth = img.width / columnsX
    // Now columnsX = stripes.length
    const stripeCount = stripes.length;
    const stripeWidthImg = img.width / stripeCount;

    let i = this.index;
    let offsetX =
      sin(customFramecount * this.animationSpeed + i) * this.amplitude;

    // Extract the portion of the image:
    // We'll take a fixed portion of the image corresponding to this stripe's index:
    let xImg = i * stripeWidthImg + offsetX;
    let wImg = stripeWidthImg;

    //constrain xpos to the image width

    // Get the image portion
    let stripeImg = img.get(xImg, 0, wImg, img.height);

    // Draw the stripe on the canvas
    push();
    translate(this.x, 0);
    image(stripeImg, 0, 0, this.w, height);

    noStroke();

    if (this.hovered) {
      // Draw a stripe overlay
      fill(this.color);
      rect(0, 0, this.w, height);

      // Show the price in the middle of the stripe
      fill(0);
      textSize(24);
      //text size depends of the width of the stripe
      textSize(this.w / 10);

      textAlign(CENTER, CENTER);
      text(this.ad.estimatedValue, this.w / 2, height / 2);
    }

    pop();
  }
}

function mousePressed() {
  for (let stripe of stripes) {
    stripe.checkHover(mouseX, mouseY);
  }
}
