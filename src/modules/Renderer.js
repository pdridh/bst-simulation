import Camera from "./Camera";
import Settings from "./Settings";

// Handles drawing of the screen
// Uses Camera for the drawing and also calculates the constraints for the Camera
class Renderer {
  constructor(tree) {
    this.canvas = document.querySelector("#canvas");
    this.canvas.width = Settings.constants.CANVAS_WIDTH;
    this.canvas.height = Settings.constants.CANVAS_HEIGHT;
    this.ctx = this.canvas.getContext("2d");

    // For restricting the camera
    this.worldBounds = {};

    // For keeping track of the renders
    this.started = false;

    this.tree = tree;

    this.camera = new Camera(this.worldBounds, this.canvas);
    this.updateWorldBounds();

    // For capping fps
    this.fps = Settings.constants.FPS;
    this.fpsInterval = 1000 / this.fps;
    this.then = Date.now();
    this.elapsed = null;
  }
  // Calculate the constraints for the Camera based on the current tree boundingBox
  updateWorldBounds() {
    if (this.tree.root === null) {
      return;
    }

    const bbox = this.tree.boundingBox;

    this.worldBounds.minX = Math.min(
      0,
      bbox.x + this.canvas.width / 2 - this.tree.root.x
    );

    this.worldBounds.maxX = Math.max(
      this.canvas.width,
      bbox.w + this.canvas.width / 2 - this.tree.root.x
    );
    this.worldBounds.minY = 0;
    this.worldBounds.maxY = Math.max(
      this.canvas.height,
      bbox.h + this.canvas.height / 2
    );

    this.worldBounds.minX -= Settings.constants.WORLD_PADDING;
    this.worldBounds.maxX += Settings.constants.WORLD_PADDING;
    this.worldBounds.maxY += Settings.constants.WORLD_PADDING;

    this.camera.updateSettings(this.worldBounds, this.canvas);
  }
}

export default Renderer;
