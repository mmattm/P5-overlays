let Subdiv = 65; // Nombre de subdivisions
let img; // Variable pour stocker l'image
let hoveredIndex = -1; // Indice du segment survolé
let timeOffsets = []; // Temps aléatoire pour chaque segment
let scaleFactorsWidth = []; // Facteurs d'échelle aléatoires pour la largeur de chaque segment

// function preload() {
//   // img = loadImage(
//   //   "https://64.media.tumblr.com/tumblr_mcqgcu37r41qcpnzho1_540.jpg"
//   // );

//   /// Get the document's root element or body
//   const captureArea = document.body;

//   // Use html2canvas with the specified viewport dimensions
//   html2canvas(captureArea, {
//     width: window.innerWidth, // Limit the width to the viewport's width
//     height: window.innerHeight, // Limit the height to the viewport's height
//   }).then((canvas) => {
//     // Convert the canvas to a data URL
//     const screenshot = canvas.toDataURL("image/png");

//     // Load the visible screenshot into p5.js
//     // img = loadImage(screenshot);
//     // console.log("screenshot", screenshot);
//     // console.log("img", img);
//     img = loadImage(screenshot, () => {
//       console.log("Image loaded successfully.");
//       //setup(); // Manually call setup when ready
//     });
//   });
// }

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);

  console.log("setup");

  /*
  // Générer des délais aléatoires pour chaque subdivision
  for (let i = 0; i < Subdiv; i++) {
    timeOffsets.push(random(0.01, 0.07)); // Décalage de temps aléatoire
    scaleFactorsWidth.push(random(0.5, 1.5)); // Facteurs d'échelle aléatoires pour la largeur
  }
  */
}

function draw() {
  console.log("draw");

  if (!img) image(img, 0, 0, width, height); // Afficher l'image source

  // fill(0);
  // rect(0, 0, width, height); // Fond noir pour l'image

  console.log("show image", img);

  /*
  let totalWidth = 0; // Variable pour garder une trace de la position horizontale
  let rectWidths = []; // Stocker les largeurs animées pour calculer l'échelle

  // Calculer les largeurs animées des segments avec une échelle aléatoire pour la largeur
  for (let i = 0; i < Subdiv; i++) {
    let rectWidth;

    // Si le segment est survolé, il cesse d'animer
    if (hoveredIndex === i) {
      rectWidth = width / Subdiv; // Largeur fixe si survolé
    } else {
      // Largeur animée avec un délai aléatoire
      let animationValue = cos(
        frameCount * timeOffsets[i] + (i * TWO_PI) / Subdiv
      );
      rectWidth =
        (width / Subdiv) * 0.5 + (width / Subdiv) * 0.5 * animationValue;
    }

    // Appliquer un facteur d'échelle aléatoire à la largeur de chaque segment
    rectWidth *= scaleFactorsWidth[i];
    rectWidths.push(rectWidth);
    totalWidth += rectWidth; // Accumuler la largeur totale
  }

  // Calculer l'échelle pour ajuster les segments pour qu'ils couvrent tout l'écran
  let taille = width / totalWidth;

  // Dessiner les segments déformés
  let currentX = 0; // Position actuelle pour dessiner les segments
  for (let i = 0; i < Subdiv; i++) {
    let rectWidth = rectWidths[i] * taille;

    // Hauteur fixe pour chaque segment
    let segmentHeight = height;

    // Vérifier si la souris est sur ce segment
    if (
      mouseX >= currentX &&
      mouseX <= currentX + rectWidth &&
      mouseY >= 0 &&
      mouseY <= segmentHeight
    ) {
      hoveredIndex = i; // On a survolé un segment
    }

    // Si survolé, rendre le segment bleu
    if (hoveredIndex === i) {
      fill(0, 0, 255); // Couleur bleue pour le fond du segment survolé
      noStroke(); // Pas de contour pour le rectangle
      rect(currentX, 0, rectWidth, segmentHeight); // Dessiner un rectangle bleu derrière l'image
    }

    // Appliquer une taille aléatoire à l'image dans chaque segment
    let imgX = map(i, 0, Subdiv, 0, img.width); // Position horizontale de la portion de l'image source
    let imgW = map(rectWidth, 0, width, 0, img.width / Subdiv); // Largeur de la portion de l'image

    // Ajuster l'image pour qu'elle couvre toute la hauteur du segment sans toucher à sa hauteur
    image(
      img,
      currentX,
      0,
      rectWidth,
      segmentHeight,
      imgX,
      0,
      imgW,
      img.height
    ); // Appliquer l'échelle aléatoire pour la largeur de l'image

    currentX += rectWidth; // Mettre à jour la position horizontale
  }
    */
}

// Réinitialiser l'indice du segment survolé lorsque la souris quitte un segment
function mousePressed() {
  hoveredIndex = -1; // Réinitialiser quand on clique ou quitte le segment
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
