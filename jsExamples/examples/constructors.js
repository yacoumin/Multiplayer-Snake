var print = require('./objectPrinting.js');
var pi = 3.14;


// Factory Function: returns an object literal
function Circle(r) {
  var o = {
    radius: r,
    area: pi*r*r,
    getCircumfrence: function() {
      return 2*pi*this.radius;
    }
  };
  return o;
}

var c = Circle(1);
print("c", c);
console.log("c.getCircumfrence(): " + c.getCircumfrence());


// // Constructor Function: uses "this" and "new" keywords
// function Circle(r) {
//   // var this = {}
//   this.radius = r;
//   this.area = pi*r*r;
//   this.getCircumfrence = function() {
//     return 2*pi*this.radius;
//   }
//   // return this;
// }
//
// var c = new Circle(1);
// print("c", c);
// console.log("c.getCircumfrence(): " + c.getCircumfrence());

module.exports = Circle;
