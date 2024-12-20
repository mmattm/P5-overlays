let osc, envelope, fft;

// let scaleArray = [60, 62, 64, 65, 67, 69, 71, 72];

let scaleArray = [60, 62, 64, 67, 69]; // C, D, E, G, A

let mondrianColors = [];
let canvas;
let soundImages = [];
let sequencerPos = 0;
let sounds = [];

// function preload() {
// // Load sounds
// sounds.push(loadSound("assets/sounds/beat.mp3"));
// sounds.push(loadSound("assets/sounds/beat2.mp3"));
// sounds.push(loadSound("assets/sounds/beat3.mp3"));
// }

class SoundImage {
  constructor(x, y, width, height, element) {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.playing = false;
    this.animationProgress = 0;
    this.rotationX = 0;
    this.rotationY = 0;
    this.rotationZ = 0;
    this.scale = 1;
    this.element = element;
    this.img = null;
    this.loadImage();
    this.pulsePhase = random(TWO_PI);
    this.verticalOffset = 0;
    this.runSound = false;
  }

  loadImage() {
    if (this.element && this.element.src) {
      loadImage(this.element.src, (img) => {
        this.img = img;
      });
    }
  }

  checkOverlap(sequencerPos) {
    if (sequencerPos >= this.x && sequencerPos <= this.x + this.width) {
      if (!this.playing) {
        this.playing = true;
        this.animationProgress = 0;
      }
    } else if (sequencerPos > this.x + this.width) {
      this.playing = false;
    }
  }

  update() {
    if (this.playing && !this.runSound) {
      // Play sound
      let midiValue = random(scaleArray);
      let freqValue = midiToFreq(midiValue);
      osc.freq(freqValue);

      envelope.play(osc, 0, 0.1);

      this.runSound = true;
    }

    if (this.playing) {
      // draw a white rectangle in place of image
      // fill(255);
      // noStroke();
      // rect(this.x, this.y, this.width, this.height);

      this.animationProgress += 0.05;

      this.rotationX = (sin(this.animationProgress * 2) * PI) / 3;
      this.rotationY = (cos(this.animationProgress * 1.5) * PI) / 2;
      this.rotationZ = (sin(this.animationProgress * 3) * PI) / 4;

      let pulseA = sin(this.animationProgress * 4 + this.pulsePhase) * 0.15;
      let pulseB = sin(this.animationProgress * 2.5) * 0.1;
      this.scale = 1 + pulseA + pulseB;

      // Vertical bounce effect
      this.verticalOffset = sin(this.animationProgress * 3) * 30;

      // hide html this element
      this.element.style.display = "none";
    } else {
      // show html this element

      if (this.scale == 1) this.element.style.display = "block";

      // Smooth return to initial state
      this.rotationX = lerp(this.rotationX, 0, 0.1);
      this.rotationY = lerp(this.rotationY, 0, 0.1);
      this.rotationZ = lerp(this.rotationZ, 0, 0.1);
      this.scale = lerp(this.scale, 1, 0.1);
      this.verticalOffset = lerp(this.verticalOffset, 0, 0.1);

      this.animationProgress = 0;

      this.runSound = false;
    }
  }

  display() {
    push();

    translate(
      this.x + this.width / 2,
      this.y + this.height / 2 + this.verticalOffset,
      sin(this.animationProgress * 2) * 50
    );

    rotateX(this.rotationX);
    rotateY(this.rotationY);
    rotateZ(this.rotationZ);

    scale(this.scale);

    if (this.playing) {
      let twist = sin(this.animationProgress * 5) * 0.1;
      applyMatrix(
        cos(twist),
        -sin(twist),
        0,
        0,
        sin(twist),
        cos(twist),
        0,
        0,
        0,
        0,
        1,
        0,
        0,
        0,
        0,
        1
      );
    }

    if (this.img) {
      imageMode(CENTER);
      image(this.img, 0, 0, this.width, this.height);
    } else {
      fill(0);
      noStroke();
      rectMode(CENTER);
      rect(0, 0, this.width, this.height);
    }

    pop();
  }
}

function setup() {
  canvas = createCanvas(windowWidth, windowHeight, WEBGL);
  setupCanvas(canvas);

  // SOUND
  osc = new p5.SinOsc();

  // Instantiate the envelope
  envelope = new p5.Env();

  // set attackTime, decayTime, sustainRatio, releaseTime
  envelope.setADSR(0.001, 0.5, 0.1, 0.5);

  // set attackLevel, releaseLevel
  envelope.setRange(1, 0);

  osc.start();

  fft = new p5.FFT();

  // add event on scroll
  window.addEventListener("scroll", onScroll);

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
    // continue if image width is bigger than 100
    if (el.width < 30) {
      return;
    }

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
          rect.height,
          el
          // random(sounds)
        )
      );
    }
  });
}

function draw() {
  canvas.clear();
  canvas.background(255);

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
  rect(0, 0, 2, height);
  pop();
}

// replace element on scroll
function onScroll() {
  for (let i = 0; i < soundImages.length; i++) {
    const el = soundImages[i];
    const rect = el.element.getBoundingClientRect();
    if (
      rect.top < window.innerHeight &&
      rect.bottom > 0 &&
      rect.left < window.innerWidth &&
      rect.right > 0
    ) {
      soundImages[i] = new SoundImage(
        rect.left,
        rect.top,
        rect.width,
        rect.height,
        el.element
      );
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  onScroll();
}

function mousePressed() {
  // Example interaction
}
