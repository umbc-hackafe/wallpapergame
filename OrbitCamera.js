OrbitCamera = function(distance, minDistance, maxDistance) {
    if(typeof distance !== 'number') distance = 10;
    if(typeof minDistance !== 'number') minDistance = 8;
    if(typeof maxDistance !== 'number') maxDistance = 100;

    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
    this.camera.userData = this;
    this.camera.matrixAutoUpdate = false;

    this.angle = new THREE.Vector2(0, 0);
    this.center = new THREE.Vector3(0, 0, 0);

    this.distance = distance;
    this.minDistance = minDistance;
    this.maxDistance = maxDistance;

    this.xRotateScale = 1.5;
    this.yRotateScale = 1.0;
    this.zoomScale = 1.0;

    this.up = new THREE.Vector3(0, 1, 0);
    this.right = new THREE.Vector3(1, 0, 0);
    this.forward = new THREE.Vector3(0, 0, -1);
};

OrbitCamera.prototype = {
    addTo: function(other) {
        other.add(this.camera);
    },
    removeFrom: function(other) {
        other.remove(this.camera);
    },

    onResize: function() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    },

    update: function(dt) {
        if(mouse.middle && !(mouse.left || mouse.right)) {
            var diff = new THREE.Vector2();
            diff.subVectors(mouse.position, mouse.oldPosition);

            this.angle.x -= diff.x * this.xRotateScale;
            this.angle.y = THREE.Math.clamp(this.angle.y - diff.y * this.yRotateScale, -.5 * Math.PI, .5 * Math.PI);
        }
        else if(mouse.right && !(mouse.left || mouse.middle)) {
            var ydiff = -(mouse.position.y - mouse.oldPosition.y) * this.zoomScale + 1;
            this.distance = THREE.Math.clamp(this.distance * ydiff, this.minDistance, this.maxDistance);
        }

        var translate = new THREE.Matrix4();
        var vrotate = new THREE.Matrix4();
        var hrotate = new THREE.Matrix4();

        translate.makeTranslation(0, 0, this.distance);
        vrotate.makeRotationX(-this.angle.y);
        hrotate.makeRotationY(this.angle.x);

        hrotate.multiply(vrotate.multiply(translate));

        this.camera.matrix.makeTranslation(this.center.x, this.center.y, this.center.z);
        this.camera.matrix.multiply(hrotate);
        this.camera.updateProjectionMatrix();

        // Track in case others need:
        this.camera.position.setFromMatrixPosition(this.camera.matrix);

        this.up.set(0, 1, 0).transformDirection(this.camera.matrix);
        this.right.set(1, 0, 0).transformDirection(this.camera.matrix);
        this.forward.set(0, 0, -1).transformDirection(this.camera.matrix);
    },
};

