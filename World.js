World = function(baseCount, center, radius) {
    if(!radius) radius = 4;
    if(!center) center = new THREE.Vector3();
    if(typeof baseCount !== 'number') baseCount = 10;

    this.geom = new THREE.IcosahedronGeometry(1, 3);
    this.material = new THREE.MeshBasicMaterial({
        //color: 0x222e54,
        color: 0xffffff,
        polygonOffset: true,
        polygonOffsetFactor: 1,
        map: THREE.ImageUtils.loadTexture('/globe-tex.png'),
    });

    this.baseMesh = new THREE.Mesh(this.geom, this.material);
    this.wireMesh = new THREE.WireframeHelper(this.baseMesh, 0x053a30);

    this.baseMesh.userData = this;
    this.wireMesh.material.transparent = true;
    this.wireMesh.material.blending = THREE.AdditiveBlending;

    this.sphere = new THREE.Sphere(center, radius);

    this.launchBases = new Array();
    for(var i = 0; i < baseCount; i++) {
        this.launchBases.push(new LaunchBase(this, 'Base ' + helpers.zeroFill(i, 2)));
    }
};

World.prototype = {
    constructor: World,

    addTo: function(other) {
        other.add(this.baseMesh);
        other.add(this.wireMesh);
        for(var i = 0; i < this.launchBases.length; i++){
            this.launchBases[i].addTo(other);
        }
    },
    removeFrom: function(other) {
        other.remove(this.baseMesh);
        other.remove(this.wireMesh);
        for(var i = 0; i < this.launchBases.length; i++){
            this.launchBases[i].removeFrom(other);
        }
    },

    update: function(dt) {
        this.baseMesh.scale.set(this.sphere.radius, this.sphere.radius, this.sphere.radius);
        this.baseMesh.position.copy(this.sphere.center);
    },

    onmouseover: function() {},
};
