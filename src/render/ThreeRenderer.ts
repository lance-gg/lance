/* global THREE */
import Renderer from './Renderer.js';


// TODO: I have mixed feelings about this class.  It doesn't actually provide
// anything useful.  I assume each game will write their own renderer even in THREE.
// we can make it store a list of objects, and provide a Raycaster, and send events.
// But it hijacks the creation of the scene and the THREE.renderer.  It doesn't make
// sense to me that the camera and lights are in the derived class, but the scene and
// renderer are in the base class.  seems like inheritance-abuse.
export default class ThreeRenderer extends Renderer {
    private scene: any;
    private camera: any;
    private renderer: any;
    private raycaster: any;
    private THREE: any;

    // constructor
    constructor(gameEngine) {
        super(gameEngine);
        this.scene = null;
        this.camera = null;
        this.renderer = null;
    }

    // setup the 3D scene
    init() {

        super.init();

        // setup the scene
        this.scene = new THREE.Scene();

        // setup the renderer and add the canvas to the body
        this.renderer = new THREE.WebGLRenderer({
            antialias: true
        });
        document.getElementById('viewport')?.appendChild(this.renderer.domElement);

        // a local raycaster
        this.raycaster = new THREE.Raycaster();

        // TODO: is this still needed?
        this.THREE = THREE;

        return Promise.resolve();
    }

    // single step
    draw() {
        this.renderer.render(this.scene, this.camera);
    }

    // add one object
    addObject(id) {
        // this.scene.add(sphere);
        // return sphere;
    }

    removeObject(o) {
        this.scene.remove(o);
    }
}