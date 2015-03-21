LightRing = function(numLights, distance, range, inclination, center) {
    if(typeof numLights !== 'number') numLights = 8;
    if(typeof distance !== 'number') distance = 7;
    if(typeof range !== 'number') range = 12;
    if(typeof inclination !== 'number') inclination = 0.2;
    if(typeof center === 'undefined') center = new THREE.Vector3();

    this.range = range;
    this.distance = distance;
    this.inclination = inclination;
    this.center = center;

    this.lights = new Array();

    for(var i = 0; i < numLights; i++) {
        var light = new THREE.PointLight(0xffffff, 1, range);
        light.matrixAutoUpdate = false;
        if(i == 0) {
            light.userData = this;
        }
        this.lights.push(light);
    }

    this.needsUpdate = true;
}

LightRing.prototype.update = function(dt) {
    if(this.needsUpdate) {
        var translate = new THREE.Matrix4();
        var vrot = new THREE.Matrix4();
        var hrot = new THREE.Matrix4();
        var recenter = new THREE.Matrix4();

        translate.makeTranslation(0, 0, this.distance);
        recenter.makeTranslation(this.center.x, this.center.y, this.center.z);

        for(var i = 0; i < this.lights.length; i++) {
            var angle = 2 * Math.PI / this.lights.length * i;

            vrot.makeRotationX(Math.sin(angle) * this.inclination);
            hrot.makeRotationY(angle);

            vrot.multiply(translate);
            hrot.multiply(vrot);

            this.lights[i].matrix.multiplyMatrices(recenter, hrot);
        }
    }

    this.needsUpdate = false;  
};

LightRing.prototype.addTo = function(other) {
    this.lights.forEach(function(light) {
        other.add(light);
    });
};

LightRing.prototype.removeFrom = function(other) {
    this.lights.forEach(function(light) {
        other.remove(light);
    });
};
