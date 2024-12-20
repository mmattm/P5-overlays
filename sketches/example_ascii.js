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
