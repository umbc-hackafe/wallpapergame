World = function(center, radius) {
    if(!radius) radius = 4;
    if(!center) center = new THREE.Vector3();

    this.geom = new THREE.IcosahedronGeometry(1, 3);
    this.material = new THREE.MeshLambertMaterial({
        color: 0x222e54,
        polygonOffset: true,
        polygonOffsetFactor: 1,
    });

    this.baseMesh = new THREE.Mesh(this.geom, this.material);
    this.wireMesh = new THREE.WireframeHelper(this.baseMesh, 0x053a30);

    this.baseMesh.userData = this;
    this.wireMesh.material.transparent = true;
    this.wireMesh.material.blending = THREE.AdditiveBlending;

    this.sphere = new THREE.Sphere(center, radius);
};

World.prototype.addTo = function(other) {
    other.add(this.baseMesh);
    other.add(this.wireMesh);
};

World.prototype.removeFrom = function(other) {
    other.remove(this.baseMesh);
    other.remove(this.wireMesh);
};

World.prototype.update = function(dt) {
    this.baseMesh.scale.set(this.sphere.radius, this.sphere.radius, this.sphere.radius);
    this.baseMesh.position.copy(this.sphere.center);
};
