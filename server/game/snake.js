require('./coord');
require('./direction');

function Snake(player,length, direction) {
    this.player = player;
    this.length = length === undefined ? 4 : length;
    this.direction = direction === undefined ? Direction.UP : direction;
    this.body = [new Coord(0,1), new Coord(0,2),
                new Coord(0,3), new Coord(0,4)];
}

Snake.prototype.setDirection = function(direction) {
    if (direction !== undefined) {
        this.direction = direction;
    }
};

Snake.prototype.getDirection = function() {
    return this.direction;
};

Snake.prototype.move = function() {
    this.body.pop();
    var new_head = this.getNextPosition();
    this.body.unshift(new_head);
};

Snake.prototype.getNextPosition = function() {
    var current_head = this.body[0];
    var next;

    if (this.direction === Direction.UP)
        next = new Coord(current_head.x, current_head.y - 1);
    else if (this.direction === Direction.DOWN)
        next = new Coord(current_head.x, current_head.y + 1);
    else if (this.direction === Direction.LEFT)
        next = new Coord(current_head.x - 1, current_head.y);
    else if (this.direction === Direction.RIGHT)
        next = new Coord(current_head.x + 1, current_head.y);

    return next;
};

Snake.prototype.grow = function() {
    this.body.unshift(this.getNextPosition());
};

Snake.prototype.shrink = function() {
    this.body.pop();
};

Snake.prototype.getLength = function() {
    return this.length;
};

Snake.prototype.setLength = function(l) {
    this.length = l;
};

Snake.prototype.getHead = function() {
    return this.body[0];
};

Snake.prototype.inSnake = function(coord) {
    for (var i=0; i < this.body.length; i++) {
        if (coord.equals(this.body[i]))
          return true;
    }
    return false;
};

Snake.prototype.getBody = function() {
    return this.body;
};

module.exports = Snake;
