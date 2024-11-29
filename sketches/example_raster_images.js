let myCanvas;

let scaleSize = 1; // Taille de départ des pixels

let totalCookies;
let cookies;

let elementsData = [];

let rastergrids = [];

function preload() {
  // loadElementsData();
  const allElements = Array.from(document.querySelectorAll("img")).filter(
    (img) => {
      return !img.src.toLowerCase().endsWith(".gif");
    }
  );

  allElements.forEach((el) => {
    const rect = el.getBoundingClientRect();

    if (el.height > 100 && el.width > 100 && rect.left > 0 && rect.top > 0) {
      rastergrids.push(
        new Rastergrid(rect.left, rect.top, rect.width, rect.height, el.src, el)
      );
    }
  });
}

function setup() {
  // Create a p5.js canvas
  myCanvas = createCanvas(windowWidth, windowHeight);

  // Set the canvas to a fixed position and give it a z-index
  myCanvas.position(0, 0); // Positions the canvas at the top-left corner
  myCanvas.style("z-index", "10000000000"); // Set z-index to 10 (or any desired value)
  myCanvas.style("position", "fixed"); // Set position to fixed

  // Move the div to the body
  document.body.appendChild(document.getElementById("defaultCanvas0"));

  totalCookies = document.cookie.split(";").length; //on récupère le nombre de cookies.
  cookies = document.cookie.split(";");
}

function draw() {
  //updateElementsPositions();
  clear();
  //frameRate(20);

  for (let rastergrid of rastergrids) {
    rastergrid.update();
    rastergrid.display();
  }
}

class Rastergrid {
  constructor(x, y, img_width, img_height, img, el) {
    this.img = loadImage(img);
    this.x = x;
    this.y = y;
    this.width = img_width;
    this.height = img_height;
    this.el = el;
    this.alt = el.alt;
  }

  update() {
    //update position from el
    const rect = this.el.getBoundingClientRect();
    this.x = rect.left;
    this.y = rect.top;
    this.width = rect.width;
    this.height = rect.height;
  }

  display() {
    noStroke();

    var shapeSize = map(200, 0, 20, 150, 500);
    var cellSize = map(200, 0, width, 2, 200); // Gestion de la taille des pixels

    push();
    translate(this.x, this.y);

    // Algorithme de dessin de l'image
    for (var x = 0; x < this.width / cellSize; x++) {
      for (var y = 0; y < this.height / cellSize; y++) {
        let c = this.img.get(x * cellSize, y * cellSize); // c = au pixel en lui-même
        let b = brightness(c); // b = à la luminosité du pixel
        push();

        let centerX = x * cellSize; // Coordonnée x du centre de la forme
        let centerY = y * cellSize; // Coordonnée y du centre de la forme

        let distance = dist(centerX, centerY, mouseX - this.x, mouseY - this.y); //on calcul la distance entre la forme et le curseur

        if (distance >= 0 && distance <= 150) {
          // Si la distance est dans la plage de 0 à 150
          scaleSize = map(distance, 0, 150, 1.7, 1);
        } else {
          // Si la distance est en dehors de la plage
          scaleSize = 1;
        }

        translate(centerX, centerY); //on change le centre

        if (b <= 20) {
          // Si la luminosité est basse
          fill("#4458E3");
          scale(scaleSize);
          rect(0, 0, cellSize, cellSize);
        } else if (b > 20 && b < 70) {
          // Si la luminosité est moyenne
          fill("#6344E3");
          scale(scaleSize);
          ellipse(cellSize / 2, cellSize / 2, cellSize);
        } else {
          // Si la luminosité est haute
          fill("#E58EF5");
          scale(scaleSize);
          triangle(0, cellSize, cellSize / 2, 0, cellSize, cellSize);
        }
        pop();
      }
    }
    pop();
  }
}
