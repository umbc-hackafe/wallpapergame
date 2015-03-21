LaunchBase = function(world, name, lat, lng) {
    if(typeof lat !== 'number') lat = THREE.Math.randFloat(-Math.PI / 6, Math.PI / 6);
    if(typeof lng !== 'number') lng = THREE.Math.randFloat(-Math.PI, Math.PI);

    this.name = name;

    this.material = new THREE.SpriteMaterial({
        color: 0xff1010,
    });
    this.material.transparent = true;
    this.material.blending = THREE.AdditiveBlending;

    this.sprite = new THREE.Sprite(this.material);
    this.sprite.matrixAutoUpdate = false;
    this.sprite.userData = this;

    this.world = world;
    this.angle = new THREE.Vector2(lng, lat);
    this.surfaceHeight = 0.15;

    this.width = 0.125;
    this.height = 0.125;

    var scale = new THREE.Matrix4();
    var translate = new THREE.Matrix4();
    var vrot = new THREE.Matrix4();
    var hrot = new THREE.Matrix4();

    scale.makeScale(this.width, this.height, 1);
    translate.makeTranslation(0, 0, world.sphere.radius + this.surfaceHeight);
    vrot.makeRotationX(this.angle.y);
    hrot.makeRotationY(this.angle.x);
    this.sprite.matrix.makeTranslation(
        world.sphere.center.x, world.sphere.center.y, world.sphere.center.z);

    this.sprite.matrix.multiply(hrot.multiply(vrot.multiply(translate.multiply(scale))));

    this.labelOffset = new THREE.Vector2(-0.062, -0.0625);
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
        other.add(this.sprite);
        ui.append(this.label);
    },
    removeFrom: function(other) {
        other.remove(this.sprite);
        this.label.remove();
    },

    update: function(dt) {
        this.sprite.position.setFromMatrixPosition(this.sprite.matrix);

        this.visibleRay.ray.origin.copy(game.camera.camera.position);
        this.visibleRay.ray.direction.subVectors(
            this.sprite.position, game.camera.camera.position);

        var distance = this.visibleRay.ray.direction.length();

        this.visibleRay.ray.direction.divideScalar(distance);
        this.visibleRay.far = distance;

        var screenPos = new THREE.Vector3()
            .copy(this.sprite.position)
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
};
