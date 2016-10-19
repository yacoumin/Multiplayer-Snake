var print = require('./objectPrinting.js');
var pi = 3.14;

// var f = Foo();       // Factory Function
// var f = new Foo();   // Constructor Function

// Constructor Function: uses "this" and "new" keywords
function Circle(r) {
  // var this = {};
  this.radius = r;
  this.area = pi*r*r;
  this.getCircumfrence = function() {
    return 2*pi*this.radius;
  }
  // return this;
}

var c = new Circle(1);
print("c", c);
console.log("c.getCircumfrence(): " + c.getCircumfrence());

module.exports = Circle;
