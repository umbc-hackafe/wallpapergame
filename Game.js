Game = function() {
    this.previous_time = 0;

    this.scene = new THREE.Scene();

    this.renderer = new THREE.WebGLRenderer({
        antialias: true,
        canvas: canvas3d.get(0),
    });

    this.camera = new OrbitCamera(10);
    this.camera.addTo(this.scene);

    this.world = new World();
    this.world.addTo(this.scene);

    // Calls to setup other things
    this.onResize();
};

Game.prototype = {
    constructor: Game,

    onResize: function() {
        this.camera.onResize();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    },

    step: function(current_time) {
        var dt = (current_time - this.previous_time) / 1000;
        this.previous_time = current_time;

        this.scene.traverse(function(obj) {
            if(typeof obj.userData.update === 'function') {
                obj.userData.update(dt);
            }
        });

        this.renderer.render(this.scene, this.camera.camera);
    },
};
