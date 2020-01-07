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

let pen = new Pen(200, 200, 0, 0, 0);

const classifier = ml5.imageClassifier(
  'https://teachablemachine.withgoogle.com/models/UDVLUh_6/model.json',
  modelLoaded
);
let capture;
let myP;

function setup() {
  createCanvas(400, 400);
  background(255);
  capture = createCapture(VIDEO);
  capture.size(320, 240);
  // capture.hide();

  // Create a <p> element to display results
  myP = createP('No input');
}

function draw() {
  // Canvas border
  noFill();
  stroke(0);
  rect(0, 0, 400, 400);

  // Display pen
  pen.display();

  // Make a prediction with a selected image
  classifier.classify(capture, (err, results) => {
    if (err) throw err;
    console.log(results[0].label);
    // Get colour based on most likely result
    let colour = nextEmote(results[0].label);
    // Update pen colour
    pen.update(colour);
    myP.html(results[0].label);
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
    Control: [255, 255, 255],
    Happiness: [255, 0, 0],
    Sadness: [0, 255, 0],
    Anger: [0, 0, 255],
    Surprise: [150, 150, 0],
    Fear: [0, 150, 150],
    Disgust: [0, 0, 0]
  };
  // Return colour as RGB values in an array
  return colours[this.label];
}
