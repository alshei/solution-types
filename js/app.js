// global variables
let solute = [];
let solvent = [];
let insideCell;
let redBloodCell;
let soluteCount = 0;
let solventCount = 0;
let solutionType = "";

// setup function
function setup() {
  createCanvas(windowWidth, windowHeight);

  redBloodCell = new RBC();
  insideCell = new Set();

  for (let i = 0; i < 20; i++) {
    // create salt solute particles
    solute.push(new Particle(30, "#FC99BB", 1, "solute"));
    // create water solvent particles
    solvent.push(new Particle(50, "#5DB1D8", 0.5, "solvent"));
  }
}

// draw function
function draw() {
  background("#eeeeee");
  const ions = [...solute, ...solvent];

  redBloodCell.display();

  for (let i = 0; i < solute.length; i++) {
    // salt solute particle
    solute[i].jitter();
    solute[i].display();

    // water solvent particle
    solvent[i].jitter();
    solvent[i].display();
  }

  for (ion of ions) {
    let distance = dist(ion.x, ion.y, redBloodCell.x, redBloodCell.y);
    if (distance < redBloodCell.diameter / 2) {
      if (!insideCell.has(ion)) {
        insideCell.add(ion);
        ion.id === "solute" ? soluteCount++ : solventCount++;
      }
    } else if (distance < redBloodCell.diameter) {
      if (insideCell.has(ion)) {
        insideCell.delete(ion);
        ion.id === "solute" ? soluteCount-- : solventCount--;
      }
    }
  }
  drawText();
}

// red blood cell class
class RBC {
  constructor() {
    (this.x = windowWidth / 2),
      (this.y = windowHeight / 2),
      (this.diameter = 400),
      (this.color = "#D62424");
  }

  display() {
    fill(this.color);
    stroke("#ffffff");
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}

// particle class
class Particle {
  constructor(diameter, color, speed, id) {
    this.x = random(window.innerWidth / 2 - 500, window.innerWidth / 2 + 500);
    this.y = random(window.innerHeight / 2 - 300, window.innerHeight / 2 + 300);
    this.diameter = diameter;
    this.color = color;
    this.speed = speed;
    this.id = id;
    this.isActive = false;
  }

  // slight jitter
  jitter() {
    this.x += random(-this.speed, this.speed);
    this.y += random(-this.speed, this.speed);
  }

  display() {
    fill(this.color);
    stroke("#ffffff");
    ellipse(this.x, this.y, this.diameter, this.diameter);
  }
}

// when mouse is pressed on an ion (solute or solvent), make active
function mousePressed() {
  const ions = [...solute, ...solvent];
  for (let i = 0; i < ions.length; i++) {
    let distance = dist(mouseX, mouseY, ions[i].x, ions[i].y);
    if (distance < ions[i].diameter) {
      ions[i].isActive = true;
    } else {
      ions[i].isActive = false;
    }
  }
}

// while ion (solute or solvent) is active, drag and drop
function mouseDragged() {
  const ions = [...solute, ...solvent];
  for (let i = 0; i < ions.length; i++) {
    if (ions[i].isActive) {
      ions[i].x = mouseX;
      ions[i].y = mouseY;
      break;
    }
  }
}

// text displays what type of solution the cell is currently in
function drawText() {
  let solutionType = calculateSolution();
  let description = "";

  switch (solutionType) {
    case "isotonic":
      description = `solvent: ${solventCount} solute: ${soluteCount}`;
      break;
    case "hypotonic":
      description = `solvent: ${solventCount} solute: ${soluteCount}`;
      break;
    case "hypertonic":
      description = `solvent: ${solventCount} solute: ${soluteCount}`;
      break;
  }

  fill("#000");
  noStroke();
  textSize(60);
  text(`${solutionType}`, 100, 100);
  fill("#000");
  noStroke();
  textSize(30);
  text(`${description}`, 100, 150);
}

// determines what type of solution the cell is currently in based on the ratio of solute and solvent
function calculateSolution() {
  if (soluteCount > solventCount) solutionType = "hypotonic";
  else if (solventCount > soluteCount) solutionType = "hypertonic";
  else solutionType = "isotonic";

  return solutionType;
}
