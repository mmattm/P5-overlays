let myCanvas;

let pageImages = [];

document.querySelectorAll("img").forEach((img) => {
  if (img.width > 200 && img.height > 200) {
    pageImages.push({ image: img.src, alt: img.alt });
  }
});

let img;
let alt = "";
let cellSize;

let startIndex = 0;
// function preload() {
//   console.log(random(images));
//   img = loadImage(random(images).src);
// }

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);

  // Set the canvas to a fixed position and give it a z-index
  myCanvas.position(0, 0);
  myCanvas.style("z-index", "10000000000"); // Set z-index to 10 (or any desired value)
  myCanvas.style("position", "fixed"); // Set position to fixed
  //myCanvas.style("pointer-events", "none");

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));

  textFont("IBM Plex Mono");
  //imageMode(CENTER);
}

function draw() {
  clear();
  background(255);

  cellSize = map(400, 0, width, 2, 100);

  push();

  if (img) {
    let charIndex = startIndex;
    translate(width / 2 - img.width / 2, height / 2 - img.height / 2);

    // Algorythm image drawing
    for (var y = 0; y < img.height / cellSize; y++) {
      for (var x = 0; x < img.width / cellSize; x++) {
        let c = img.get(x * cellSize, y * cellSize);
        let b = brightness(c);
        //let w = map(b, 0, 255, -300, 300);
        let w = map(b, 0, 255, 0, 1);

        push();
        //rotateY(frameCount * 0.01);
        translate(x * cellSize, y * cellSize);

        //rotate(frameCount * 0.05);
        fill(255);

        if (b > mouseX * 0.1) fill(0);

        //ellipse(0, 0, 5);
        //rect(0,0, map(b,0,255,0,cellSize*2),map(b,0,255,0,cellSize*2));

        //rect(0, 0, cellSize, cellSize);
        textAlign(CENTER, CENTER);
        textSize(map(img.width, 0, width, 5, 32));
        //for positioning of the poem
        text(alt.charAt(charIndex % alt.length), 0, 0);
        charIndex++;
        //rect(0, 0, 2, 10);
        pop();

        // fill(0, green(c), 0, green(c));
        // fill(red(c), 0, 0, red(c));
        // rect(x + 10, y + 10, 1, 1);
        // fill(0, 0, blue(c));
        // rect(x + 20, y + 20, 1, 1);
      }
    }
    if (frameCount % 10 == 0) startIndex++;
  }
  //if (img) image(img, 0, 0);

  /*
  if (img) {
    //
    let charIndex = startIndex;
    let w = width / img.width;
    let h = height / img.height;

    //translate(img.width / 2, -img.height / 2);
    translate(width / 2 - img.width / 2, height / 2 - img.height / 2);

    //Waves();
    
    img.loadPixels();
    //So over here we are making use of a pixel array in p5js
    //every pixel has an rgb value and a alpha value, stored in an array so we go to that particular pixel using the formula i + j * me.widthand then access the values.
    for (let j = 0; j < img.height; j++) {
      for (let i = 0; i < img.width; i++) {
        const pixelIndex = (i + j * img.width) * 4;
        const r = img.pixels[pixelIndex + 0];
        const g = img.pixels[pixelIndex + 1];
        const b = img.pixels[pixelIndex + 2];
        const avg = (r + g + b) / 3;

        noStroke();
        //to change the color of the text according to the rgb value of the pixel position in the pixel array
        // if (mouseIsPressed) {
        //   fill(r, g, b);
        // } else {
        //   fill(avg);
        // }
        fill(avg);

        textSize(w * 1.2);
        textAlign(CENTER, CENTER);

        //for positioning of the poem
        text(alt.charAt(charIndex % alt.length), i, j);
        charIndex++;
      }
    }
    //counter to move the poem according to the framerate
    startIndex++;
  }
  */

  pop();
}

function mousePressed() {
  //random value of pageImages array
  let randomIndex = Math.floor(Math.random() * pageImages.length);
  console.log(randomIndex);

  img = loadImage(pageImages[randomIndex].image);
  // get alt of image

  alt = pageImages[randomIndex].alt;
  console.log(img);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
