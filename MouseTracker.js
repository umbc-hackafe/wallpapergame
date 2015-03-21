MouseTracker = function() {
    this.left = false;
    this.wasLeft = false;
    this.right = false;
    this.wasRight = false;
    this.middle = false;
    this.wasMiddle = false;
    this.position = new THREE.Vector2();
    this.oldPosition = new THREE.Vector2();

    this.mouseRay = new THREE.Raycaster();

    this.hovered = null;
};

MouseTracker.prototype = {
    constructor: MouseTracker,

    preUpdate: function() {
        this.mouseRay.setFromCamera(this.position, game.camera.camera);
        this.intersects = this.mouseRay.intersectObjects(game.scene.children);

        if(this.intersects.length  > 0) {
            console.log('intersect found');
            for(var i = 0; i < this.intersects.length; i++) {
                if(typeof this.intersects[i].object.userData.onmouseover === 'function') {
                    if(this.intersects[i].object.userData !== this.hovered) {
                        if(this.hovered !== null) {
                            this.hovered.onmouseout();
                        }
                        this.hovered = this.intersects[i].object.userData;
                        this.hovered.onmouseover();
                    }
                    break;
                }
            }
        }
        else {
            if(this.hovered !== null) {
                this.hovered.onmouseout();
                this.hovered = null;
            }
        }

        console.log(this.hovered);
    },
    postUpdate: function() {
        this.wasLeft = this.left;
        this.wasRight = this.right;
        this.wasMiddle = this.middle;
        this.oldPosition.copy(this.position);
    },

    onMouseMove: function(event) {
        this.position.x = (event.clientX / window.innerWidth) * 2 - 1;
        this.position.y = -(event.clientY / window.innerHeight) * 2 + 1;
    },
    onMouseDown: function(event) {
        if(event.button == 0) this.left = true;
        else if(event.button == 1) this.middle = true;
        else if(event.button == 2) this.right = true;
    },
    onMouseUp: function(event) {
        if(event.button == 0) this.left = false;
        else if(event.button == 1) this.middle = false;
        else if(event.button == 2) this.right = false;
    },
};
