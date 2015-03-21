LaunchBase = function(lat, lng) {
    if(typeof lat !== 'number') lat = THREE.Math.randFloat(-Math.PI / 2, Math.PI/2);
    if(typeof lng !== 'number') lng = THREE.Math.randFloat(-Math.PI, Math.PI);

    this.material = new THREE.SpriteMaterial({
        color: 0xff0000,
    });
    this.material.transparent = true;
    this.material.blending = THREE.AdditiveBlending;

    this.sprite = new THREE.Sprite(this.material);
    this.sprite.matrixAutoUpdate = false;
    this.sprite.userData = this;

    this.angle = new THREE.Vector2(lng, lat);
    this.surfaceHeight = 0.15;
    this.width = 0.2;
    this.height = 0.2;

    var scale = new THREE.Matrix4();
    var translate = new THREE.Matrix4();
    var vrot = new THREE.Matrix4();
    var hrot = new THREE.Matrix4();

    scale.makeScale(this.width, this.height, 1);
    translate.makeTranslation(0, 0, game.world.sphere.radius + this.surfaceHeight);
    vrot.makeRotationX(this.angle.y);
    hrot.makeRotationY(this.angle.x);
    this.sprite.matrix.makeTranslation(game.world.sphere.center.x, game.world.sphere.center.y, game.world.sphere.center.z);

    translate.multiply(scale);
    vrot.multiply(translate);
    hrot.multiply(vrot);
    this.sprite.matrix.multiply(hrot);
};

LaunchBase.prototype.addTo = function(other) {
    other.add(this.sprite);
};

LaunchBase.prototype.removeFrom = function(other) {
    other.remove(this.sprite);
};
