var Coord = require('./coord');
var Direction = require('./direction');

function Snake(length, direction, width, height) {
    var DEFAULT_LEN = 4;
    var thisLength;
    var thisDirection;
    var thisBody;
    var thisPreviousTail;

    initialize(length, direction, width, height);

    function initialize(len, dir, w, h) {
      thisLength = (len > h/2 || len > w/2) ? DEFAULT_LEN : len;
      if (dir) {
        thisDirection = dir;
      }
      else {
        thisDirection = Direction.UP;
      }
      var start_x = Math.floor(w/2);
      var start_y = Math.floor(h/2);
      thisBody = Array();

      for (var i=0; i < thisLength; i++) {
          thisBody.push(new Coord(start_x, start_y + i));
      }
      thisPreviousTail = thisBody[thisBody.length - 1];
    }

    function isGoodMove(dir) {
      if ((thisDirection === Direction.UP) && ((dir === Direction.DOWN) || (dir === Direction.UP)))
          return false;
      else if ((thisDirection === Direction.DOWN) && ((dir === Direction.UP) || (dir === Direction.DOWN)))
          return false;
      else if ((thisDirection === Direction.LEFT) && ((dir === Direction.RIGHT) || (dir === Direction.LEFT)))
          return false;
      else if ((thisDirection === Direction.RIGHT) && ((dir === Direction.LEFT) || (dir === Direction.RIGHT)))
          return false;
      return true;
    }

    function setDirection(user, direction, callback) {
        if (direction !== undefined) {
          if (isGoodMove(direction)) {
            thisDirection = direction;
            callback(user, direction);
          }
        }
    };

    function getHead() {
        return thisBody[0];
    }

    function getDirection() {
        return thisDirection;
    };

    function move() {
        thisPreviousTail = thisBody.pop();
        var new_head = getNextPosition();
        thisBody.unshift(new_head);
    };

    function getPreviousTail() {
        return thisPreviousTail;
    }

    function getNextPosition() {
        var current_head = getHead();
        var next;

        if (thisDirection === Direction.UP)
            next = new Coord(current_head.x, current_head.y - 1);
        else if (thisDirection === Direction.DOWN)
            next = new Coord(current_head.x, current_head.y + 1);
        else if (thisDirection === Direction.LEFT)
            next = new Coord(current_head.x - 1, current_head.y);
        else if (thisDirection === Direction.RIGHT)
            next = new Coord(current_head.x + 1, current_head.y);

        return next;
    };

    function grow() {
        thisLength++;
        thisBody.unshift(getNextPosition());
    };

    function shrink() {
        thisLength--;
        thisBody.pop();
    };

    function getLength() {
        return thisLength;
    };

    function setLength(l) {
        thisLength = l;
    };

    function inSnake(coord) {
        for (var i=0; i < thisBody.length; i++) {
            if (coord.equals(thisBody[i]))
              return true;
        }
        return false;
    };

    function getBody() {
        return thisBody;
    };

    return {
        initialize: initialize,
        body: thisBody,
        previousTail: thisPreviousTail,
        getPreviousTail: getPreviousTail,
        length: thisLength,
        direction: thisDirection,
        getBody: getBody,
        getHead: getHead,
        inSnake: inSnake,
        setDirection: setDirection,
        getNextPosition: getNextPosition,
        grow: grow,
        move: move
    };
}
module.exports = Snake;
