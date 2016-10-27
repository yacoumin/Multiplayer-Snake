/* Snake class
 *  - Interacts with / contained by snake game to provide some snake information:
 *    ~ length
 *    ~ position
 *    ~ direction
 *    ~ next snake position
*/


var Coord = require('./coord');
var Direction = require('./direction');

function Snake(l, d, width, height) {
    var DEFAULT_LEN = 4;
    var length;
    var direction;
    var body;
    var previousTail;

    initialize(l, d, width, height);

    function initialize(len, dir, w, h) {
      length = (len > h/2 || len > w/2) ? DEFAULT_LEN : len;
      if (dir) {
        direction = dir;
      }
      else {
        direction = Direction.UP;
      }
      var start_x = Math.floor(w/2);
      var start_y = Math.floor(h/2);
      body = Array();

      for (var i=0; i < length; i++) {
          body.push(new Coord(start_x, start_y + i));
      }
      previousTail = body[body.length - 1];
    }

    function isGoodMove(dir) {
      if ((direction === Direction.UP) && ((dir === Direction.DOWN) || (dir === Direction.UP)))
          return false;
      else if ((direction === Direction.DOWN) && ((dir === Direction.UP) || (dir === Direction.DOWN)))
          return false;
      else if ((direction === Direction.LEFT) && ((dir === Direction.RIGHT) || (dir === Direction.LEFT)))
          return false;
      else if ((direction === Direction.RIGHT) && ((dir === Direction.LEFT) || (dir === Direction.RIGHT)))
          return false;
      return true;
    }

    function setDirection(userMove, callback) {
        if (userMove != undefined) {
          if (userMove.direction !== undefined) {
            if (isGoodMove(userMove.direction)) {
              direction = userMove.direction;
              callback(userMove.user, userMove.direction);
            }
          }
        }
    };

    function getHead() {
        return body[0];
    }

    function getDirection() {
        return direction;
    };

    function move() {
        previousTail = body.pop();
        var new_head = getNextPosition();
        body.unshift(new_head);
    };

    function getPreviousTail() {
        return previousTail;
    }

    function getNextPosition() {
        var current_head = getHead();
        var next;

        if (direction === Direction.UP)
            next = new Coord(current_head.x, current_head.y - 1);
        else if (direction === Direction.DOWN)
            next = new Coord(current_head.x, current_head.y + 1);
        else if (direction === Direction.LEFT)
            next = new Coord(current_head.x - 1, current_head.y);
        else if (direction === Direction.RIGHT)
            next = new Coord(current_head.x + 1, current_head.y);

        return next;
    };

    function grow() {
        length++;
        body.unshift(getNextPosition());
    };

    function shrink() {
        length--;
        body.pop();
    };

    function getLength() {
        return length;
    };

    function setLength(l) {
        length = l;
    };

    function inSnake(coord) {
        for (var i=0; i < body.length; i++) {
            if (coord.equals(body[i]))
              return true;
        }
        return false;
    };

    function getBody() {
        return body;
    };

    return {
        initialize: initialize,
        body: body,
        previousTail: previousTail,
        getPreviousTail: getPreviousTail,
        length: length,
        direction: direction,
        getBody: getBody,
        getHead: getHead,
        inSnake: inSnake,
        setDirection: setDirection,
        getNextPosition: getNextPosition,
        getLength: getLength,
        grow: grow,
        move: move
    };
}
module.exports = Snake;
