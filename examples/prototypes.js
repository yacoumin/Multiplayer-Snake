// Prototype pattern
function Vehicle(){}

Vehicle.prototype.name = "A Vehicle";
Vehicle.prototype.noise = "Zoom";
Vehicle.prototype.go = function() {
  console.log(this.noise);
}

var v1 = new Vehicle();
console.log("name 1: " + v1.name);
v1.go();

v1.name = "Automobile";
v1.noise = "vroom";
v1.go = function() {
  console.log(this.noise + " " + this.noise);
};

console.log("name 1: " + v1.name);
v1.go();

var v2 = new Vehicle();
console.log("name 2: " + v2.name);
v2.go();
