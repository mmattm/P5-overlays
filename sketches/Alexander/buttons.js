let nodes = [];
let noNodes = 60; // Limite du nombre de boutons
let clicked = false;
let lerpValue = 0.2;
let closeNode;
let gravityConstant = 1.1;
let forceConstant = 10000; // Force répulsive initiale
let scrollFactor = 0.5; // Facteur initial de répulsion
let cursorForceMultiplier = 0.7; // Multiplicateur pour la force répulsive du curseur
let currentNodeCount = 0; // Compte le nombre de noeuds créés
let totalNodes = 0; // Compte le nombre total de noeuds créés
let lastNodeTime;
let frameInterval = 30; // Interval in frames (e.g., 60 frames = 1 second)
let flatLinks = [];

let clickText = ["Click me", "Click here", "Click now", "Click this"];

let mode = 0;

function setup() {
  // Crée un canevas couvrant toute la fenêtre
  let canvas = createCanvas(windowWidth, document.body.scrollHeight);

  // setup random mode 0-2 int
  mode = Math.floor(random(0, 3));

  // disable click on page

  setupCanvas(canvas);
  canvas.style("pointer-events", "none");

  // Ajoute les noeuds progressivement
  //   frameRate(60);

  flatLinks = [
    ...metadatas.links.internal.map((link) => ({ ...link, external: false })), // Add external: false for internal links
    ...metadatas.links.external.map((link) => ({ ...link, external: true })), // Add external: true for external links
  ];

  totalNodes = flatLinks.length;

  console.log("Nombre total de noeuds à ajouter :", totalNodes);
}

function draw() {
  clear();
  // Add nodes every second
  // Add a node every `frameInterval` frames
  if (currentNodeCount < totalNodes && frameCount % frameInterval === 0) {
    let link = flatLinks[currentNodeCount];
    nodes.push(
      new Node(
        createVector(random(width), random(height)),
        100,
        link,
        random(clickText)
      )
    );
    currentNodeCount++;
  }

  // Applique les forces sur tous les noeuds
  applyForces(nodes);

  // Met à jour et affiche chaque noeud
  nodes.forEach((node) => {
    node.update();
    node.draw();
  });

  // Déplace le rectangle le plus proche lorsque cliqué
  if (clicked && closeNode) {
    let mousePos = createVector(mouseX, mouseY);
    closeNode.pos.lerp(mousePos, lerpValue);
    if (lerpValue < 0.95) {
      lerpValue += 0.02;
    }
  }
}

function mousePressed() {
  clicked = true;
  let mousePos = createVector(mouseX, mouseY);

  // Trouve le noeud le plus proche de la souris
  closeNode = nodes.reduce((closest, node) => {
    let currentDist = mousePos.copy().sub(node.pos).mag() - node.size;
    let closestDist = mousePos.copy().sub(closest.pos).mag() - closest.size;
    return currentDist < closestDist ? node : closest;
  }, nodes[0]);

  console.log("Noeud le plus proche sélectionné :", closeNode);
}

function mouseReleased() {
  clicked = false;
  lerpValue = 0.8;
}

function addNode() {
  let x = width / 2; // Centre horizontal
  let y = window.scrollY + windowHeight / 2; // Centre vertical visible
  let color = random(["red", "green"]);
  let node = new Node(createVector(x, y), random(40, 100), color);
  nodes.push(node);
  currentNodeCount++;
  console.log(`Noeud ajouté. Total : ${currentNodeCount}`);
}

function applyForces(nodes) {
  // Détermine le centre visible (centre de la fenêtre)
  let centerY = window.scrollY + windowHeight / 2;
  let center = createVector(width / 2, centerY);

  nodes.forEach((node) => {
    let distanceToCenter = center.copy().sub(node.pos).mag();

    // Applique une force gravitationnelle vers le centre visible
    let gravity = center
      .copy()
      .sub(node.pos)
      .mult(gravityConstant * node.gravityFactor * (distanceToCenter / 500));
    node.force = gravity;

    // Applique une force répulsive supplémentaire autour de la souris
    let mousePos = createVector(mouseX, mouseY);
    let dirToMouse = node.pos.copy().sub(mousePos);
    let distanceToMouse = dirToMouse.mag();
    if (distanceToMouse > 0) {
      let cursorForce = dirToMouse
        .div(distanceToMouse * distanceToMouse)
        .mult(forceConstant * cursorForceMultiplier);
      node.force.add(cursorForce);
    }
  });

  // Applique une force répulsive entre les noeuds
  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      let pos = nodes[i].pos;
      let dir = nodes[j].pos.copy().sub(pos);
      let distance = dir.mag();
      if (distance > 0) {
        let force = dir
          .div(distance * distance)
          .mult(forceConstant * scrollFactor);
        nodes[i].force.add(force.copy().mult(-1));
        nodes[j].force.add(force);
      }
    }
  }
}

class Node {
  constructor(pos, size, link, text) {
    this.pos = pos;
    this.size = size;
    this.color = "black";
    this.link = link;
    this.text = text;
    this.vel = createVector(random(-2, 2), random(-2, 2)); // Vitesse aléatoire
    this.force = createVector(0, 0);
    this.blinkSpeed = random(200, 500); // Vitesse aléatoire de clignotement
    this.lastBlinkTime = millis(); // Temps de clignotement initial
    this.blinkState = true; // État du clignotement
    this.gravityFactor = random(0.5, 1.5); // Facteur individuel de gravité

    this.holdStartTime = null; // Start time for mouse hold
    this.holdDurationThreshold = 1000; // Threshold in milliseconds (1 second)

    if (this.link.external) {
      this.color = "red";
    } else {
      this.color = "green";
    }
  }

  update() {
    // Ajoute la force à la vitesse
    this.vel.add(this.force.copy().div(this.size));
    this.vel.limit(5); // Limite la vitesse maximale

    // Déplace le noeud
    this.pos.add(this.vel);

    // Rebonds sur les bords
    if (this.pos.x < 0 || this.pos.x > width) this.vel.x *= -1;
    if (this.pos.y < 0 || this.pos.y > height) this.vel.y *= -1;

    // Met à jour l'état du clignotement
    if (millis() - this.lastBlinkTime > this.blinkSpeed) {
      this.blinkState = !this.blinkState;
      this.lastBlinkTime = millis();
    }

    // Check for mouse press and hold
    if (this.isMouseOver()) {
      if (mouseIsPressed) {
        if (!this.holdStartTime) {
          this.holdStartTime = millis(); // Start the timer
        } else if (millis() - this.holdStartTime > this.holdDurationThreshold) {
          // If held for more than the threshold, go to the URL
          //window.open(this.link.url, "_blank");
          window.location = this.link.url;
          this.holdStartTime = null; // Reset the timer
        }
      } else {
        // Reset the timer if the mouse is released
        this.holdStartTime = null;
      }
    } else {
      // Reset the timer if the mouse moves off the node
      this.holdStartTime = null;
    }
  }

  isMouseOver() {
    // Check if the mouse is over the node
    return (
      mouseX > this.pos.x - this.size / 2 &&
      mouseX < this.pos.x + this.size / 2 &&
      mouseY > this.pos.y - this.size / 4 &&
      mouseY < this.pos.y + this.size / 4
    );
  }

  draw() {
    switch (mode) {
      case 0:
        // a
        break;
      case 1:
        // b
        break;
      case 2:
        // c
        break;
    }

    rectMode(CENTER);

    // Effet 3D avec plusieurs couches pour renforcer la perspective
    let depth = 5; // Nombre de couches
    for (let i = depth; i > 0; i--) {
      fill(
        this.color === "red" ? "rgba(0, 0, 0, 0.5)" : "rgba(255, 0, 0, 0.5)"
      ); // Couleur adaptée pour chaque type de bouton
      rect(this.pos.x + i, this.pos.y + i, this.size, this.size / 2);
    }

    // Rectangle principal
    fill(this.color === "red" ? "rgba(255, 0, 0, 1)" : "rgba(0, 255, 0, 1)");
    rect(this.pos.x, this.pos.y, this.size, this.size / 2);

    // Ajuste la taille du texte à la taille du rectangle
    let textSizeValue = Math.min(this.size, this.size / 2 / 2);
    textSize(textSizeValue);

    // Applique la police et ajuste l'alignement
    textFont("Geo");
    textAlign(CENTER, CENTER);

    // Texte clignotant avec vitesse individuelle
    fill(this.color === "red" ? 255 : 0); // Texte blanc pour rouge, noir pour vert
    if (this.blinkState) {
      text(this.text, this.pos.x, this.pos.y);
    }
  }
}

// Écoute l'événement de scroll
window.addEventListener("scroll", windowScrolled);

function windowScrolled() {
  // Ajuste la force répulsive en fonction du scroll cyclique
  let scrollY = window.scrollY;
  let scrollRange = 400; //
  let spreadRange = 1000; //

  // Calcule une valeur cyclique entre 0 et 1
  let cycleProgress = (scrollY % scrollRange) / scrollRange;

  // Ajuste la force en fonction du cycle, avec une zone de transition élargie
  if (cycleProgress <= 0.5) {
    let t = map(cycleProgress, 0, 0.5, 0, 1);
    t = constrain(t, 0, 1);
    scrollFactor = lerp(random(1, 1.5), random(0.001, 0.009), easeInOutQuad(t));
  } else {
    let t = map(cycleProgress, 0.5, 1, 0, 1);
    t = constrain(t, 0, 1);
    scrollFactor = lerp(random(0.001, 0.009), random(1, 1.5), easeInOutQuad(t));
  }
}

function easeInOutQuad(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
