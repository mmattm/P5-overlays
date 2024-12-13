let mondrianColors = [];
let canvas;
let soundImages = [];

let sequencerPos = 0;

let sounds = [];

// function preload() {
//   // Load sounds
//   sounds.push(loadSound("assets/sounds/beat.mp3"));
//   sounds.push(loadSound("assets/sounds/beat2.mp3"));
//   sounds.push(loadSound("assets/sounds/beat3.mp3"));
// }

class SoundImage {
  constructor(x, y, width, height) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.playing = false;
    this.animationProgress = 0;
  }

  // Check if the sequencer line overlaps this image
  checkOverlap(sequencerPos) {
    if (sequencerPos > this.x) {
      if (!this.playing) {
        this.playing = true;
        this.animationProgress = 0.1;
      }
    }
  }

  // Update the animation state
  update() {
    this.animationProgress = lerp(0, this.animationProgress, 0.95);

    // If desired, you could reset animationProgress when not playing, etc.
  }

  // Draw the image rectangle
  display() {
    // push();
    // translate(this.x, this.y);
    // fill(this.animationProgress, 0, 0);
    // noStroke();
    // rect(0, 0, this.width, this.height);
    // pop();

    push();
    translate(this.x, this.y);
    rotateY(sin(frameCount * this.animationProgress) * PI * 0.5);
    fill(0);
    noStroke();
    rect(0, 0, this.width, this.height);
    pop();
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setupCanvas(canvas);

  mondrianColors = [
    color(255), // White
    color(0, 0, 255), // Blue
  ];

  updateElementsData();
}

function updateElementsData() {
  soundImages = []; // Clear previous data

  // Select all images
  const allElements = document.querySelectorAll("img");

  allElements.forEach((el) => {
    const rect = el.getBoundingClientRect();

    // Check if the element is visible in the viewport
    if (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    ) {
      // Create a new SoundImage instance
      soundImages.push(
        new SoundImage(
          rect.left,
          rect.top,
          rect.width,
          rect.height
          //   random(sounds)
        )
      );
    }
  });
}

function draw() {
  canvas.clear();
  translate(-width / 2, -height / 2);

  // Update and display each SoundImage
  for (let el of soundImages) {
    el.checkOverlap(sequencerPos);
    el.update();
    el.display();
  }

  // Update the sequencer position
  sequencerPos++;
  if (sequencerPos > width) {
    sequencerPos = 0;
    // reset all sound Images
    soundImages.forEach((el) => {
      el.playing = false;
      el.animationProgress = 0;
    });
  }

  // Draw vertical line (sequencer)
  push();
  translate(sequencerPos, 0);
  fill(255, 0, 0);
  noStroke();
  rect(0, 0, 1, height);
  pop();
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function mousePressed() {
  // Example interaction
}
