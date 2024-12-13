let mondrianColors = [];
let canvas;

let animations = [];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);

  // Initial calculation
  updateElementsData();

  // Update positions on scroll
  window.addEventListener("scroll", updateElementsData);

  console.log(metadatas.socialNetworks.socialNetworks);

  const elements = document.querySelectorAll("img, h1, h2, h3, h4, h5, h6");

  elements.forEach((el) => {
    const rect = el.getBoundingClientRect(); // Get element's position and size
    animations.push({
      type: random(metadatas.socialNetworks.socialNetworks),
      x: rect.left + random(rect.width),
      y: rect.top,
      randomDelay: 1000 + random(0),
      animationProgress: 0,
    });
  });
}

function draw() {
  clear();
  // loop over animations
  animations.forEach((animation) => {
    if (millis() > animation.randomDelay) {
      animation.animationProgress += 0.01;

      push();
      // Draw text
      textAlign(CENTER, CENTER);
      textSize(64);

      // switch depends of type change emoji
      translate(animation.x, animation.y);
      rotate(animation.animationProgress);

      switch (animation.type.network) {
        case "instagram":
          text("❤️", 0, 0);
          break;
        case "tiktok":
          text("🦷", 0, 0);
          break;
        case "twitter":
          text("🐥", 0, 0);
          break;
      }
      pop();
    }
  });
}

function mousePressed() {
  // Check if mouse is over any animation
  animations.forEach((animation) => {
    // Approximate hitbox size (can be adjusted)
    const hitboxSize = 50;

    if (
      mouseX > animation.x - hitboxSize / 2 &&
      mouseX < animation.x + hitboxSize / 2 &&
      mouseY > animation.y - hitboxSize / 2 &&
      mouseY < animation.y + hitboxSize / 2
    ) {
      console.log("Clicked on animation:", animation);
      // change location on href
      window.location = animation.type.url;
    }
  });
}

function updateElementsData() {
  // Update positions of animations dynamically
  const elements = document.querySelectorAll("img, h1, h2, h3, h4, h5, h6");

  elements.forEach((el, index) => {
    const rect = el.getBoundingClientRect(); // Get updated position and size
    if (animations[index]) {
      //animations[index].x = rect.left + rect.width / 2;
      animations[index].y = rect.top;
    }
  });
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
  updateElementsData();
}
