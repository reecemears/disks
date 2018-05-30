var disks = [];
var numdisks = 50;
var canvaswidth = 300;
var canvasheight = 300;

var seedButton;
var started = false;

var diskSlider;
var sliderButton;

function setup() {
  createCanvas(canvaswidth, canvasheight);
  disks = [];
  removeElements();

  if (!started) randomSeed(99);
  started = true;

  seedButton = createButton("Change random seed");
  seedButton.position(canvaswidth + 50, 50);
  seedButton.mousePressed(changeSeed);

  diskSlider = createSlider(1, 0.25*canvasheight, numdisks);
  diskSlider.position(canvaswidth + 50, 75);

  sliderButton = createButton("Reset");
  sliderButton.position(diskSlider.x + diskSlider.width + 25, diskSlider.y);
  sliderButton.mousePressed(changeNumDisks);

  for (var i = 0; i < numdisks; i++) {
    disks[i] = new Disk(10, 3);
    while (disks[i].overlapping()) disks[i].randomStart(); // Reposition each disk as necessary to avoid collisions
  }
}

function draw() {
  background(120);
  translate(canvaswidth/2, canvasheight/2); // Move origin of coordinate axis to centre

  for (var i = 0; i < disks.length; i++) {
    disks[i].render();
  }

  var j = Math.round(random(numdisks-1));
  disks[j].propose(); // Propose (and act on) noise given to a random disk
}

function changeSeed() {
  randomSeed(Math.round(random(1, 100)));
  setup();
}

function changeNumDisks() {
  numdisks = Math.round(diskSlider.value());
  setup();
}

var Disk = function(radius, delta) {

  this.randomStart = function() {
    this.pos = createVector(random(-canvaswidth/2, canvaswidth/2), random(-canvasheight/2, canvasheight/2));
  }

  this.radius = radius;
  this.delta = delta;
  this.pos;
  this.randomStart();

  this.render = function() {
    fill(255);
    noStroke();
    ellipse(this.pos.x, this.pos.y, this.radius*2, this.radius*2);
  }

  // If the proposal is valid, accept; otherwise, reject
  this.propose = function() {
    var oldPos = this.pos.copy();
    this.pos.add(random(-1*this.delta, this.delta), random(-1*this.delta, this.delta));
    if (this.overlapping()) this.pos = oldPos.copy();
  }

  this.overlapping = function() {
    if (!this.onscreen()) return true;
    var exacts = 0;
    for (var i = 0; i < disks.length; i++) {
      var d = disks[i];
      if (d.pos.x == this.pos.x && d.pos.y == this.pos.y) exacts++;
      else if (this.pos.dist(d.pos) < d.radius + this.radius) return true;
    }
    return (exacts > 1); // Only one disk may share its exact position (the disk itself)
  }

  this.onscreen = function() {
    if (this.pos.x < -canvaswidth/2 + this.radius || this.pos.x > canvaswidth/2 - this.radius) return false;
    if (this.pos.y < -canvasheight/2 + this.radius || this.pos.y > canvasheight/2 - this.radius) return false;
    return true;
  }

}
