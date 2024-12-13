let c02;

async function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);
  c02 = await calculatePageSizeAndCO2();

  console.log("DEBUG:");
  console.log(c02);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
