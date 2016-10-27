/* Provides control of the snake
 * - Binds up/down/left/right arrows to ajax calls which hit endpoints to
 *   change the direction of the snake for the current game.
*/

function postAjax(path){
    $.ajax({
        type: 'POST',
        url: path,
        data: {}
    });
}

$(function(){
  $("#control-panel").find("button").on('click', function(){
    postAjax(window.location.pathname + "/" + $(this).text());
  });

  $(document).keydown(function(e) {
    var current_path = window.location.pathname;
    var Key = {LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};

    if (37 <= e.which && e.which <= 40){
      switch (e.which) {
        case Key.LEFT:
          postAjax(current_path + "/left");
          break;
        case Key.UP:
          postAjax(current_path + "/up");
          break;
        case Key.RIGHT:
          postAjax(current_path + "/right");
          break;
        case Key.DOWN:
          postAjax(current_path + "/down");
          break;
      }
      e.preventDefault();
    }
  })
})
