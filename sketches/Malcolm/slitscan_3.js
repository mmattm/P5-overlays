let customFramecount = 0;
let stripes = []; // Will hold our Stripe objects
let img;
let canvas;
//let hoverSound; //Malcolm - CRéATION DE VARIABLE POUR LE SON

let mondrianColors = ["#000EBF", "#000991", "#0000ff"]; //Malcolm - CHANGEMENT DE COULEUR

async function setup() {
  //hoverSound = loadSound("assets/coin.mp3"); //Malcolm - INCRéMENTATION DU SON
  const captureArea = document.body;

  await html2canvas(captureArea, {
    width: window.innerWidth,
    height: window.innerHeight,
    useCORS: true,
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

  textFont("Helvetica Neue"); // Malcolm - CHANGEMENT DE TYPO
}

// Initialize the stripes based on metadatas.ads array
function initializeStripes() {
  // Number of stripes based on metadatas.ads length
  //const stripeCount = metadatas.ads.ads.length;
  const stripeCount = round(random(5, 10)); // Malcolm - CHANGEMENT DU NOMBRE DE STRIPES

  // Generate random values for each stripe
  let randomValues = [];
  for (let i = 0; i < stripeCount; i++) {
    randomValues.push(random(0.1, 2)); // arbitrary random range
  }

  // Sum the random values
  let totalRandom = randomValues.reduce((acc, val) => acc + val, 0);

  // Create stripes with normalized widths
  let currentX = 0;

  if (metadatas.ads.ads.length > 0) {
    for (let i = 0; i < stripeCount; i++) {
      let w = (randomValues[i] / totalRandom) * width;
      let stripe = new Stripe(
        i,
        currentX,
        w,
        random(metadatas.ads.ads),
        random(mondrianColors)
      );
      stripes.push(stripe);
      currentX += w;
    }
  }
}

function customDraw() {
  customFramecount++;
  clear();

  // fill(0);
  // rect(0, 0, width, height);

  // if metadata adds length is 0, we show a big text in the middle of the screen
  if (metadatas.ads.ads.length === 0) {
    textSize(width / 20);
    textAlign(CENTER, CENTER);

    // Calculate text dimensions for the box
    const textWidthValue = textWidth("👀 No ads found"); // Get text width
    const textHeightValue = textAscent() + textDescent(); // Get text height

    // Calculate position for the box
    const boxX = (width - textWidthValue) / 2; // Center horizontally
    const boxY = (height - textHeightValue) / 2; // Center vertically
    const padding = 20; // Add padding around the text

    // Draw the black box
    fill(0); // Set fill color to black
    noStroke(); // No border
    rect(
      boxX - padding,
      boxY - padding,
      textWidthValue + 2 * padding,
      textHeightValue + 2 * padding
    );

    // Draw the text
    fill(255); // Set fill color to white
    text("👀 No ads found", width / 2, height / 2);
  }

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
    // Nombre de bandes
    const stripeCount = stripes.length;
    const stripeWidthImg = img.width / stripeCount;

    let i = this.index; // Index de la bande

    // Amplitude influencée par la position de la souris
    // Plus la souris est proche de la bande, plus l'amplitude est élevée
    let distanceFromMouse = abs(mouseX - this.x); // Distance horizontale entre la souris et la bande
    let influenceFactor = map(distanceFromMouse, 0, width, 1, 0); // Influence décroissante avec la distance
    let dynamicAmplitude = this.amplitude * influenceFactor; // Ajuster l'amplitude

    // Calcul du décalage horizontal
    let offsetX =
      sin(customFramecount * this.animationSpeed + i) * dynamicAmplitude;

    // Portion de l'image correspondant à cette bande
    let xImg = i * stripeWidthImg + offsetX;
    let wImg = stripeWidthImg;

    // Assurez-vous que xImg reste dans les limites de l'image
    xImg = constrain(xImg, 0, img.width - wImg);

    // Extraire la portion de l'image
    let stripeImg = img.get(xImg, 0, wImg, img.height);

    // Étirez l'image
    let stretch = this.w;

    // Gestion de la transparence avec un délai
    const delayPerStripe = 10; // Décalage entre chaque bande (en frames)
    const timeOffset = i * delayPerStripe; // Décalage temporel pour cette bande
    const effectiveFrame = max(0, customFramecount - timeOffset); // Prend en compte le délai
    const alpha = constrain(effectiveFrame, 0, 255); // Alpha progresse avec le temps

    // Dessiner la bande sur le canvas
    push();
    translate(this.x, 0);
    tint(255, alpha * 3); // Applique la transparence avec un délai
    image(stripeImg, 0, 0, stretch, height);
    noTint(); // Réinitialise la transparence

    noStroke();

    // Dessiner le survol
    if (this.hovered) {
      // Couche de surbrillance
      fill(red(this.color), green(this.color), blue(this.color), 200);
      rect(0, 0, this.w, height);

      // Affiche la valeur estimée
      fill(255); // Texte en blanc
      textSize(24);
      textSize(this.w / 5); // Taille du texte basée sur la largeur

      textAlign(CENTER, CENTER);
      push();
      translate(this.w / 2, height / 2); // Centre de la bande
      rotate(-HALF_PI); // Rotation de 90 degrés
      if (this.ad?.estimatedValue) text(this.ad.estimatedValue, 0, 0); // Affiche le texte
      pop();
    }

    pop();
  }
}

function mousePressed() {
  for (let stripe of stripes) {
    stripe.checkHover(mouseX, mouseY);
  }
}
