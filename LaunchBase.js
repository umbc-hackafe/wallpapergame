LaunchBase = function(world, name, lat, lng) {
    if(typeof lat !== 'number') lat = THREE.Math.randFloat(-Math.PI / 6, Math.PI / 6);
    if(typeof lng !== 'number') lng = THREE.Math.randFloat(-Math.PI, Math.PI);

    this.name = name;

    this.geom = new THREE.BoxGeometry(0.125, 0.125, 0.125);
    this.material = new THREE.MeshBasicMaterial({
        color: 0xff1010,
    });
    this.material.transparent = true;
    this.material.blending = THREE.AdditiveBlending;

    this.box = new THREE.Mesh(this.geom, this.material);
    this.box.matrixAutoUpdate = false;
    this.box.userData = this;

    this.world = world;
    this.angle = new THREE.Vector2(lng, lat);
    this.surfaceHeight = 0.062;

    var translate = new THREE.Matrix4();
    var vrot = new THREE.Matrix4();
    var hrot = new THREE.Matrix4();

    translate.makeTranslation(0, 0, world.sphere.radius + this.surfaceHeight);
    vrot.makeRotationX(this.angle.y);
    hrot.makeRotationY(this.angle.x);
    this.box.matrix.makeTranslation(
        world.sphere.center.x, world.sphere.center.y, world.sphere.center.z);

    this.box.matrix.multiply(hrot.multiply(vrot.multiply(translate)));

    // update for ease of use.
    this.box.position.setFromMatrixPosition(this.box.matrix);

    this.labelOffset = new THREE.Vector2(-0.062, -0.125);
    this.label = $('<div>', {class: 'label'}).text(this.name).css({
        color: '#ff1010',
        display: 'block',
    });
    this.visibleRay = new THREE.Raycaster();

    this.cutoffDistance = 15;
};

LaunchBase.prototype = {
    constructor: LaunchBase,

    addTo: function(other) {
        other.add(this.box);
        ui.append(this.label);
    },
    removeFrom: function(other) {
        other.remove(this.box);
        this.label.remove();
    },

    update: function(dt) {
        this.visibleRay.ray.origin.copy(game.camera.camera.position);
        this.visibleRay.ray.direction.subVectors(
            this.box.position, game.camera.camera.position);

        var distance = this.visibleRay.ray.direction.length();

        this.visibleRay.ray.direction.divideScalar(distance);
        this.visibleRay.far = distance;

        var screenPos = new THREE.Vector3()
            .copy(this.box.position)
            .add(game.camera.up.clone().multiplyScalar(this.labelOffset.y))
            .add(game.camera.right.clone().multiplyScalar(this.labelOffset.x))
            .project(game.camera.camera);

        if(distance < this.cutoffDistance &&
            screenPos.z >= 0 &&
            this.visibleRay.intersectObject(game.world.baseMesh, false).length <= 0) {
            this.label.css({
                display: 'block',
                left: (screenPos.x + 1) / 2 * window.innerWidth,
                top: (screenPos.y - 1) / 2 * -window.innerHeight,
            });
        }
        else {
            this.label.css({
                display: 'none',
            });
        }
    },

    onmouseover: function() {
    },
    onmouseout: function() {
    },

    onmouseup: function(event) {
    },
};
