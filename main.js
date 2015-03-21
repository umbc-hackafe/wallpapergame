var game;
var mouse;

var ui;
var canvas2d;
var canvas3d;

function step(timestamp) {
    requestAnimationFrame(step);
    mouse.preUpdate();
    game.step(timestamp);
    mouse.postUpdate();
}

$(document).ready(function() {
    ui = $('#ui');
    canvas2d = $('#canvas2D');
    canvas3d = $('#canvas3D');

    game = new Game();
    mouse = new MouseTracker();

    requestAnimationFrame(step);

    $(window).resize(function() { game.onResize(); });

    $(document).mousemove(function(event) { mouse.onMouseMove(event); });
    $(document).mousedown(function(event) { mouse.onMouseDown(event); });
    $(document).mouseup(function(event) { mouse.onMouseUp(event); });
    $(document).on('contextmenu', function() { return false; });
});
