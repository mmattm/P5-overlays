const { Engine, Bodies, Composite, Constraint } = Matter;

let engine;
let creatures = [];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);
  //createCanvas(windowWidth, windowHeight); //pour tests

  let trackerNb = metadatas.trackers.length;
  //let trackerNb = floor(random(2, 10)); //pour tests

  engine = Engine.create();
  engine.world.gravity.y = 1; // ++ pour se balancer plus vite

  // Extract domain from the source URL
  function extractDomain(url) {
    let domain;
    try {
      domain = new URL(url).hostname; // Extracts the full hostname like "www.google.com"
      domain = domain.split(".").slice(-2).join("."); // Keeps only "google.com"
    } catch (error) {
      domain = "unknown"; // Fallback for invalid URLs
    }
    return domain;
  }

  //Position random des débuts de pendule (le long du haut)
  for (let i = 0; i < trackerNb; i++) {
    let x = random(200, width - 200);
    let y = 0;

    let tracker = metadatas.trackers[i];
    let domain = extractDomain(tracker.source); // Extract domain from source

    creatures.push(new Creature(x, y, domain));
  }

  console.log(creatures);

  const mouse = Matter.Mouse.create(canvas.elt); // Attach the mouse to the canvas
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse: mouse,
    constraint: {
      stiffness: 0.2, // Adjust for dragging responsiveness
      render: {
        visible: false, // Set to true for debugging
      },
    },
  });

  // Add the mouse constraint to the world
  Composite.add(engine.world, mouseConstraint);
}

function draw() {
  //   background(255); // transparent??
  clear();

  Engine.update(engine);

  //Affichage des araignées
  creatures.forEach((creature) => {
    creature.applyInitialForce();
    creature.show();
  });

  fill(0);
}

//javascript file w/matter.js

let speed = 0.01;

class Creature {
  constructor(x, y, domain) {
    //reprend les pos générées dans le setup

    this.rY = random(50, 200); //diametre Y araignées
    this.rX = this.rY * 1.4; //diametre X araignées
    this.r = 40;
    this.len = random(height / 4, height - height / 8); //longueur du fil
    this.mode = round(random(2)); //pour versions différentes

    this.anchor = Bodies.circle(x, y, this.r, { isStatic: true }); //début fil ?
    this.bob = Bodies.circle(x + this.len, y - this.len, this.r, {
      //?? y - et pas y+
      restitution: 0.6,
      mass: 32,
      inertia: Infinity,
      friction: 0.1,
    });

    //fil?
    this.arm = Constraint.create({
      bodyA: this.anchor,
      bodyB: this.bob,
      length: this.len,
      stiffness: 0,
    });

    this.force = random(0, 2); // différentes rapidité de balancement

    this.startAnimation = frameCount;

    this.domain = domain;
    this.disabled = false; // Track if the creature is disabled

    Composite.add(engine.world, [this.anchor, this.bob, this.arm]);
  }

  // Method to disable the creature
  disable() {
    this.disabled = true;
    //Composite.remove(engine.world, [this.anchor, this.bob, this.arm]); // Remove it from the world
  }

  // Check if mouse click is on this creature
  isClicked(mx, my) {
    const d = dist(mx, my, this.bob.position.x, this.bob.position.y);
    return d < this.r; // Check if within radius of the bob
  }

  //application de la force appelée dans class flum
  applyInitialForce() {
    const force = Matter.Vector.create(0, this.force);
    Matter.Body.applyForce(this.bob, this.bob.position, force); //d'ou vient this.bob.position?
  }

  show() {
    // repris dans draw pour le faire apparaitre

    //Fil dessin
    switch (this.mode) {
      case 0:
        stroke("green");
        break;
      case 1:
        stroke("orange");
        break;
      case 2:
        stroke("purple");
        break;
    }

    strokeWeight(2);
    line(
      this.anchor.position.x,
      this.anchor.position.y,
      this.bob.position.x,
      this.bob.position.y
    );

    //Araignée dessin
    push();
    translate(this.bob.position.x, this.bob.position.y); //positioner au bout du fil

    drawSpiderStatic(
      this.mode,
      0,
      0,
      this.rX,
      this.rY,
      this.disabled,
      this.domain
    );

    if (!this.disabled) {
      drawEyes(
        this.mode,
        0,
        0,
        this.rX,
        this.rY,
        this.bob.position.x,
        this.bob.position.y
      );
    }

    drawLegs(this.mode, 0, 0, this.rX, this.rY, this.startAnimation);

    pop();
  }
}

function drawSpiderStatic(mode, x, y, rX, rY, disabled, domain) {
  // Body

  strokeWeight(2);
  switch (mode) {
    case 0:
      fill("green");
      stroke("green");
      ellipse(x, y, rX, rY);
      break;
    case 1:
      fill("orange");
      stroke("orange");
      ellipse(x, y, rX, rY);
      break;
    case 2:
      fill("purple");
      stroke("purple");
      ellipse(x, y, rX, rY);
      break;
  }

  if (!disabled) {
    // Eyes (blanc)
    switch (mode) {
      case 0:
        stroke("red");
        fill("red");
        break;
      case 1:
        stroke("blue");
        fill("blue");
        break;
      case 2:
        stroke("yellow");
        fill("yellow");
        break;
    }

    //   fill(255);
    ellipse(x - rX / 6, y, rX / 3, rX / 3);
    ellipse(x + rX / 6, y, rX / 3, rX / 3);
  } else {
    // draw text inside body
    fill(255);
    noStroke();
    textAlign(CENTER, CENTER);
    textSize(20);
    text(domain, x, y);
  }

  // Fil -> inutile car dans show
  //strokeWeight(2);
  //line(x, 0, x, y);
}

function drawLegs(mode, x, y, rX, rY, startAnimation) {
  strokeWeight(10);
  switch (mode) {
    case 0:
      stroke("green");
      break;
    case 1:
      stroke("orange");
      break;
    case 2:
      stroke("purple");
      break;
  }

  noFill();

  for (let i = 0; i < 4; i++) {
    let index = i * 1.5; //valeur decallage pos
    let time = startAnimation + frameCount * speed; //valeur decallage mov

    //Gauche
    push();
    translate(0, (index * rY) / 8); //decallage Start
    //Bras 1
    translate(x - 3 * (rX / 8), y - 2 * (rY / 8));
    rotate(sin(time + index) * PI * 0.1);
    line(0, 0, -3 * (rX / 8), -3 * (rY / 8));
    //Bras 2
    translate(-3 * (rX / 8), -3 * (rY / 8));
    rotate(sin(time + i + 1) * PI * 0.1);
    line(0, 0, -4 * (rX / 8), -1 * (rY / 8));
    pop();

    //Droite
    push();
    translate(0, (index * rY) / 8); //decallage Start
    //Bras 1
    translate(x + 3 * (rX / 8), y - 2 * (rY / 8));
    rotate(sin(time + index) * PI * 0.1);
    line(0, 0, 3 * (rX / 8), -3 * (rY / 8));
    //Bras 2
    translate(3 * (rX / 8), -3 * (rY / 8));
    rotate(sin(time + i + 1) * PI * 0.1);
    line(0, 0, 4 * (rX / 8), -1 * (rY / 8));
    pop();
  }
}

function drawEyes(mode, x, y, rX, rY, offsetX, offsetY) {
  let mouseVector = createVector(mouseX - offsetX, mouseY - offsetY);

  let leftEye = createVector(x - rX / 6, y);
  let rightEye = createVector(x + rX / 6, y);

  let leftPupil = leftEye.copy().add(
    mouseVector
      .copy()
      .sub(leftEye)
      .setMag(rX / 16)
  );
  let rightPupil = rightEye.copy().add(
    mouseVector
      .copy()
      .sub(rightEye)
      .setMag(rX / 16)
  );
  //console.log(leftEye, rightEye);
  switch (mode) {
    case 0:
      fill("green");
      break;
    case 1:
      fill("orange");
      break;
    case 2:
      fill("purple");
      break;
  }
  ellipse(leftPupil.x, leftPupil.y, rX / 8);
  ellipse(rightPupil.x, rightPupil.y, rX / 8);
}

function mousePressed() {
  for (let i = creatures.length - 1; i >= 0; i--) {
    if (creatures[i].isClicked(mouseX, mouseY)) {
      creatures[i].disable(); // Disable the creature
      console.log("Creature disabled");

      break; // Exit loop after disabling one creature
    }
  }
}
