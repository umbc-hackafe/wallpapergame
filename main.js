var game;
var mouse;

function step(timestamp) {
    requestAnimationFrame(step);
    mouse.preUpdate();
    game.step(timestamp);
    mouse.postUpdate();
}

$(document).ready(function() {
    var canvas3d = $('#canvas3D').get(0);

    game = new Game(canvas3d);
    mouse = new MouseTracker();

    requestAnimationFrame(step);

    $(window).resize(function() { game.onResize(); });

    $(document).mousemove(function(event) { mouse.onMouseMove(event); });
    $(document).mousedown(function(event) { mouse.onMouseDown(event); });
    $(document).mouseup(function(event) { mouse.onMouseUp(event); });
    $(document).on('contextmenu', function() { return false; });
});
