var print = require('./objectPrinting.js');
var pi = 3.14;

// Prototypes and Inheritance
/*
  Inheritance in Javascript is done with
  "Prototype Chains"

  Let's make our Circle class inherit from
  a Shape class:
*/

function Shape() {
  this.x = 0;
  this.y = 0;
  this.move = function(x, y) {
    this.x += x;
    this.y += y;
    console.log("moving shape ...");
  }
}

function Circle(r) {
  this.radius = r;
  this.area = pi*r*r;
  this.getCircumfrence = function() {
    return 2*pi*this.radius;
  }
}

var shapeObject = new Shape();
Circle.prototype = shapeObject;


var c = new Circle(1);
// Prototype Chain of c:
// Circle --> Shape --> Object.prototype --> null


// Let's see how c works:
print("c", c);
console.log("c.getCircumfrence(): " + c.getCircumfrence());
console.log("c.x: " + c.x);
console.log("c.y: " + c.y);
c.move(1,2);
console.log("c.x: " + c.x);
console.log("c.y: " + c.y);
console.log("c.blarg: " + c.blarg);
console.log("c instanceof Circle: " + (c instanceof Circle));
console.log("c instanceof Shape: " + (c instanceof Shape));
