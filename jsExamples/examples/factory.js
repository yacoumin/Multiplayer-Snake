var print = require('./objectPrinting.js');
var pi = 3.14;

// Factory Functions

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

console.log(c.getCircumfrence());
