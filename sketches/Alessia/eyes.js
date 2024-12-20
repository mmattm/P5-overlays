const { Engine, Bodies, Composite, Constraint } = Matter;

let engine;
let creatures = [];

//p5.js file

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);

  //let trackerNb = floor(random(2, 10)); // à lier aux metadatas.tracker

  // number from metadatas.trackers.length
  let trackerNb = metadatas.trackers.length;

  engine = Engine.create();
  engine.world.gravity.y = 1; // ++ pour se balancer plus vite

  //Position random des débuts de pendule (le long du haut)
  for (let i = 0; i < trackerNb; i++) {
    let x = random(200, width - 200);
    let y = 0;
    creatures.push(new Creature(x, y));
  }

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
  constructor(x, y) {
    //reprend les pos générées dans le setup

    this.rY = random(50, 200); //diametre Y araignées
    this.rX = this.rY * 1.4; //diametre X araignées
    this.r = 40;
    this.len = random(height / 4, height - height / 8); //longueur du fil
    this.mode = round(random(2));

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

    Composite.add(engine.world, [this.anchor, this.bob, this.arm]);
  }

  //application de la force appelée dans class flum
  applyInitialForce() {
    const force = Matter.Vector.create(0, this.force);
    Matter.Body.applyForce(this.bob, this.bob.position, force); //d'ou vient this.bob.position?
  }

  show() {
    // repris dans draw pour le faire apparaitre

    //Fil dessin

    stroke(0);
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

    drawSpiderStatic(this.mode, 0, 0, this.rX, this.rY);
    drawEyes(0, 0, this.rX, this.rY, this.bob.position.x, this.bob.position.y);
    drawLegs(0, 0, this.rX, this.rY, this.startAnimation);

    pop();
  }
}

function drawSpiderStatic(mode, x, y, rX, rY) {
  // Body
  fill(0);
  stroke(0);
  strokeWeight(2);
  ellipse(x, y, rX, rY);

  // Eyes (blanc)
  switch (mode) {
    case 0:
      fill(255);
      break;
    case 1:
      fill(255, 0, 0);
      break;
    case 2:
      fill(0, 255, 0);
      break;
  }

  //   fill(255);
  ellipse(x - rX / 6, y, rX / 3, rX / 3);
  ellipse(x + rX / 6, y, rX / 3, rX / 3);

  // Fil -> inutile car dans show
  //strokeWeight(2);
  //line(x, 0, x, y);
}

function drawLegs(x, y, rX, rY, startAnimation) {
  strokeWeight(10);
  stroke(0);
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

function drawEyes(x, y, rX, rY, offsetX, offsetY) {
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
  fill(0);
  ellipse(leftPupil.x, leftPupil.y, rX / 8);
  ellipse(rightPupil.x, rightPupil.y, rX / 8);
}
