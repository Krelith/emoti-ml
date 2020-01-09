/* 
Instructions to open

Open index.html in a browser
/*

class Pen {
  constructor(x, y, r, g, b) {
    this.x = x;
    this.y = y;
    this.r = r;
    this.g = g;
    this.b = b;
    this.xc = 0;
    this.yc = 0;
  }
  display() {
    noStroke();
    fill(this.r, this.g, this.b);
    ellipse(this.x, this.y, 10, 10);
  }
  update(colour) {
    this.colour = colour;
    this.xc += random(0.01, 0.02);
    this.yc += random(0.02, 0.03);
    let dx = noise(this.xc) * width;
    let dy = noise(this.yc) * height;
    this.x = dx;
    this.y = dy;
    this.r = this.colour[0];
    this.g = this.colour[1];
    this.b = this.colour[2];
  }
}

let pen = new Pen(200, 200, 255, 255, 255);

const classifier = ml5.imageClassifier(
  'https://teachablemachine.withgoogle.com/models/drzk7vnk/model.json',
  modelLoaded
);
let capture;
let guess1;
let guess2;
let guess3;

function setup() {
  createCanvas(400, 300);
  background(255);
  capture = createCapture(VIDEO);
  capture.size(400, 300);
  capture.hide();

  // Create a <p> element to display results
  guess1 = createP('No input');
  guess2 = createP('No input');
  guess3 = createP('No input');
}

function draw() {
  // Canvas border
  noFill();
  stroke(0);
  rect(0, 0, 400, 300);

  image(capture, 0, 0);

  // Display pen
  // pen.display();

  // Make a prediction with a selected image
  classifier.classify(capture, (err, results) => {
    if (err) throw err;
    // console.log(results[0].label);

    if (results[0].label !== 'Control') {
      // Get colour based on most likely result
      let colour = nextEmote(results[0].label);
      // Update pen colour
      // pen.update(colour);
      fill(colour[0], colour[1], colour[2], 100);
      rect(0, 0, 400, 400);
      guess1.html(`Primary guess: ${results[0].label}`);
      guess2.html(`Secondary guess: ${results[1].label}`);
      guess3.html(`Tertiary guess: ${results[2].label}`);
      fill(255);
      textSize(24);
      text(results[0].label, 250, 280);
    } else {
      guess1.html(`No input`);
      guess2.html(``);
      guess3.html(``);
    }
  });
}

// Show the model is loaded
function modelLoaded() {
  console.log('Model Loaded!');
}

// Use the latest result to get the corresponding colour
function nextEmote(label) {
  this.label = label;
  let colours = {
    Control: [255, 255, 255], // White (Erasure relative to background)
    Happiness: [255, 255, 0], // Yellow
    Sadness: [0, 0, 150], // Blue
    Anger: [150, 0, 0], // Red
    Surprise: [0, 200, 0], // Green
    // Fear: [0, 150, 150],
    Disgust: [150, 0, 75] // Purple
  };
  // Return colour as RGB values in an array
  return colours[this.label];
}
