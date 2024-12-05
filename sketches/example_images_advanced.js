let img;
let alt_text = "";
let imgs = [];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);
  imageMode(CENTER);
}

function draw() {
  //background(0);
  clear();

  if (mouseIsPressed && img && frameCount % 2 == 0) {
    // Resize images trop grandes
    const scaleFactor = max(img.width / (width / 2), img.height / height, 1);

    const displayWidth = (img.width / scaleFactor) * sin(frameCount / 100);
    const displayHeight = (img.height / scaleFactor) * sin(frameCount / 100);

    // push img to imgs array with coordinates and size
    imgs.push({
      img: img,
      x: mouseX,
      y: mouseY,
      w: displayWidth,
      h: displayHeight,
    });
  }

  // display all images in imgs array
  imgs.forEach((img) => {
    image(img.img, img.x, img.y, img.w, img.h);
  });

  // pop progresively images from imgs array
  if (imgs.length > 0 && frameCount % 5 == 0) {
    imgs.shift();
  }

  if (imgs.length > 0) {
    // Center text on screen
    textSize(width / 10);
    textAlign(CENTER, CENTER);
    fill(255);
    textFont("IBM Plex Mono");
    textLeading(width / 10);

    text(alt_text, 0, 0, width, height);
  }
}

function mousePressed() {
  if (metadatas.images.length > 0) {
    let random_img = random(metadatas.images);

    img = loadImage(random_img.src);

    if (random_img.alt) {
      //alt_text = random_img.alt;

      // call typeWriter function
      alt_text = "";

      if (random_img.alt != "undefined") typeWriter(random_img.alt);
    }
  }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

function keyPressed() {
  // if delete key is pressed clear the canvas
  if (keyCode === DELETE || keyCode === BACKSPACE) {
    clear();
  }
}

let typingTimeout = null; // To track the current timeout

function typeWriter(text_input) {
  // Clear the previous timeout if it exists
  if (typingTimeout) {
    clearTimeout(typingTimeout);
    typingTimeout = null;
  }

  alt_text = ""; // Reset the text
  let index = 0;

  // Define the typing loop
  function typeNextChar() {
    if (index < text_input.length) {
      alt_text += text_input[index];
      index++;

      // Schedule the next character and store the timeout ID
      typingTimeout = setTimeout(typeNextChar, random(50, 140));
    } else {
      // Clear the timeout once typing is complete
      typingTimeout = null;
    }
  }

  // Start typing the first character
  typeNextChar();
}
