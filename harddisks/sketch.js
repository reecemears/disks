var disks = [];
var numdisks = 50;
var canvaswidth = 300;
var canvasheight = 300;

function setup() {
  createCanvas(canvaswidth, canvasheight);

  for (var i = 0; i < numdisks; i++) {
    disks[i] = new Disk(10, 3);
    while (disks[i].overlapping()) disks[i].randomStart();
  }
}

function draw() {
  background(120);
  translate(canvaswidth/2, canvasheight/2);

  for (var i = 0; i < disks.length; i++) {
    disks[i].render();
  }

  var j = Math.round(random(numdisks-1));
  disks[j].propose();
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
    return (exacts > 1);
  }

  this.onscreen = function() {
    if (this.pos.x < -canvaswidth/2 + this.radius || this.pos.x > canvaswidth/2 - this.radius) return false;
    if (this.pos.y < -canvasheight/2 + this.radius || this.pos.y > canvasheight/2 - this.radius) return false;
    return true;
  }

}
