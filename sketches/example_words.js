let myCanvas;

let words = [];

let googleLinks = document.querySelectorAll(
  "#search a[jsname][ping][data-ved]"
);
let googleWords = [];

let margins = 260;

function setup() {
  myCanvas = createCanvas(windowWidth, windowHeight);

  // Set the canvas to a fixed position and give it a z-index
  myCanvas.position(0, 0);
  myCanvas.style("z-index", "10000000000"); // Set z-index to 10 (or any desired value)
  myCanvas.style("position", "fixed"); // Set position to fixed
  //myCanvas.style("pointer-events", "none");

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));

  //words.push(new Word("Hello"));

  textFont("Rubik Bubbles");

  for (let link of googleLinks) {
    let word = link.querySelector("h3").innerText;
    googleWords.push({ link: link.href, word: word });
  }

  for (let word of googleWords) {
    words.push(new Word(word.word, word.link));
  }
}

function draw() {
  clear();

  for (let word of words) {
    word.update();
    word.display();
    word.checkClick(false);
  }

  console.log(frameRate());
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}

class Word {
  constructor(word, link) {
    this.position = new createVector(random(width), random(height));
    this.velocity = new createVector(random(-1, 1), random(-1, 1));
    this.width = 0;
    this.height = 0;
    this.word = word;
    this.color = color(random(255), random(255), random(255));
    this.ogColor = this.color;
    this.textSize = 128;
    this.link = link;
    this.rotateSpeed = random(0.001, 0.005);
    this.rotateStartPos = random(0, 360);
  }

  update() {
    // Add the current speed to the position.
    this.position.add(this.velocity);

    // Bouncing off the edges
    if (this.position.x > width + margins || this.position.x < 0 - margins) {
      this.velocity.x = this.velocity.x * -1;
    }
    if (this.position.y > height + margins || this.position.y < 0 - margins) {
      this.velocity.y = this.velocity.y * -1;
    }

    // if (this.position.x >= width) {
    //   this.position.x = this.radius;
    // }

    // if (this.position.x <= 0) {
    //   this.position.x = width - this.radius;
    // }
  }

  checkClick(click) {
    // if click on word
    // Calculate text bounds
    // Set text properties
    push();
    textSize(this.textSize); // set your desired text size

    // Align text to LEFT and TOP for calculating bounds
    textAlign(LEFT, TOP);

    // Calculate text width and height
    let theTextWidth = textWidth(this.word);
    let theTextHeight = textAscent() + textDescent();

    // Calculate the bounding box
    let bbox = {
      x: this.position.x - theTextWidth / 2,
      y: this.position.y - theTextHeight / 2,
      w: theTextWidth,
      h: theTextHeight,
    };

    // Check if the mouse click is within the text bounds
    if (
      mouseX > bbox.x &&
      mouseX < bbox.x + bbox.w &&
      mouseY > bbox.y &&
      mouseY < bbox.y + bbox.h
    ) {
      console.log("click :" + this.word);
      this.color = color(0);
      //cursor(HAND);

      if (click) {
        window.location.href = this.link;
      }
    } else {
      this.color = this.ogColor;
      //cursor(ARROW);
    }
    pop();
  }

  display() {
    // Display circle at x position
    push();
    stroke(0);
    fill(175);
    noStroke();
    translate(this.position.x, this.position.y);
    rotate(sin(this.rotateStartPos + frameCount * this.rotateSpeed) * 1);
    textSize(this.textSize);
    textAlign(CENTER, CENTER);
    fill(this.color);
    text(this.word, 0, 0);
    //ellipse(0, 0, this.radius, this.radius);
    pop();
  }
}

function mousePressed() {
  for (let word of words) {
    word.checkClick(true);
  }
}
