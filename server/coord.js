function Coord(x,y) {
    this.x = x === undefined ? 0 : x;
    this.y = y === undefined ? 0 : y;
}

Coord.prototype.equals = function(coord) {
    return (this.x === coord.x) && (this.y === coord.y);
}

Coord.prototype.getX = function(){
  return this.x;
}

Coord.prototype.getY = function(){
  return this.y;
}

module.exports = Coord;
