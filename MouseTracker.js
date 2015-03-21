function MouseTracker() {
    this.left = false;
    this.wasLeft = false;
    this.right = false;
    this.wasRight = false;
    this.middle = false;
    this.wasMiddle = false;
    this.position = new THREE.Vector2();
    this.oldPosition = new THREE.Vector2();

    this.startTarget = $('.covercanvas').get(0);

    this.mouseRay = new THREE.Raycaster();
}

MouseTracker.prototype.preUpdate = function() {
    this.mouseRay.setFromCamera(this.position, game.camera.camera);
};

MouseTracker.prototype.postUpdate = function() {
    this.wasLeft = this.left;
    this.wasRight = this.right;
    this.wasMiddle = this.middle;
    this.oldPosition.copy(this.position);
};

MouseTracker.prototype.onMouseMove = function(event) {
    this.position.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.position.y = -(event.clientY / window.innerHeight) * 2 + 1;
};

MouseTracker.prototype.onMouseDown = function(event) {
    if(event.target == this.startTarget) {
        if(event.button == 0) this.left = true;
        else if(event.button == 1) this.middle = true;
        else if(event.button == 2) this.right = true;
    }
};

MouseTracker.prototype.onMouseUp = function(event) {
    if(event.button == 0) this.left = false;
    else if(event.button == 1) this.middle = false;
    else if(event.button == 2) this.right = false;
};
