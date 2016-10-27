/*
 * Direction enumeration used to provide direction data to clients 
 * (e.g. who pressed which key) as well as calculating a snakes next position
 * when a game tick occurs.
*/

var Direction = {
  UP: 0,
  DOWN: 1,
  LEFT: 2,
  RIGHT: 3,
  NameFromValue: function(dir) {
    switch(dir) {
      case this.UP:
        return "UP";
        break;
      case this.DOWN:
        return "DOWN";
        break;
      case this.LEFT:
        return "LEFT";
        break;
      case this.RIGHT:
        return "RIGHT";
        break;
    }
  }
};

module.exports = Direction;
