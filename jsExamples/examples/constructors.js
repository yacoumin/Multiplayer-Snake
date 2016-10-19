var print = require('./objectPrinting.js');

// Constructor Pattern
function Vehicle(vehicleName) {
  this.name = vehicleName;
  this.noise = "Zoom";
  this.go = function() {
    console.log(this.noise);
  }
}

var v1 = new Vehicle("Vehicle 1");
print("v1", v1);
v1.go();

v1.noise = "zip";
v1.go();
