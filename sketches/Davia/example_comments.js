let ribbons = [];

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);
  setupCanvas(canvas);

  textFont("IBM Plex Mono");

  console.log(metadatas.comments);

  metadatas.comments.forEach((comment) => {
    ribbons.push({
      active: false,
      comment: comment,
      line: comment.line,
      py_1: random(height),
      py_2: random(height),
    });
  });
}

function draw() {
  // get scroll position on page
  let scrollY = window.scrollY;

  // get total page height
  let pageHeight = document.body.scrollHeight;

  // get the number of lines in the HTML content
  let htmlContent = document.documentElement.outerHTML;
  let lines = htmlContent.split(/\r?\n/);
  let linesLength = lines.length;

  console.log("lines length: ", linesLength);

  let scrollValue = map(scrollY, 0, pageHeight, 0, 255);

  let currentLine = Math.floor((scrollY / pageHeight) * linesLength);

  metadatas.comments.forEach((comment) => {
    if (currentLine >= comment.line) {
      // find the corresponding ribbon and set it to active
      ribbons.forEach((ribbon) => {
        if (ribbon.line === comment.line) {
          ribbon.active = true;
        }
      });
      //console.log("Passed comment at line", comment.line, ":", comment.content);
    }
  });

  clear();

  //Draw ribbons
  push();
  ribbons.forEach((ribbon) => {
    if (ribbon.active) {
      let x = 0;
      let y = ribbon.py_1;
      let x2 = width;
      let y2 = ribbon.py_2;

      stroke(255, 0, 0);
      strokeWeight(60);
      line(x, y, x2, y2);
    }
  });

  pop();

  // for(let i; i < metadatas.comments.length; i++) {
  // let comment = metadatas.comments[i];
  // }
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight);
}
