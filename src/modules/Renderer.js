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

  // Render a node using its x and y positions
  // Also render its edge to connect to its parent
  renderNode(data, x, y, parentX, parentY) {
    // Draw circle
    this.ctx.fillStyle = Settings.constants.NODE_COLOR;
    this.ctx.beginPath();
    this.ctx.arc(
      x,
      y,
      Settings.constants.NODE_RADIUS,
      0,
      Settings.constants.MAX_RADIAN
    );

    // Border
    this.ctx.fill();
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = Settings.constants.BORDER_COLOR;
    this.ctx.stroke();

    // Node data
    this.ctx.font = Settings.constants.DATA_FONT;
    this.ctx.fillStyle = Settings.constants.DATA_COLOR;
    this.ctx.textAlign = "center";
    this.ctx.fillText(data, x, y + Settings.constants.TEXT_OFFSET);

    // Edges
    this.ctx.beginPath();
    this.ctx.moveTo(parentX, parentY + Settings.constants.NODE_RADIUS);
    this.ctx.lineTo(x, y - Settings.constants.NODE_RADIUS);
    this.ctx.stroke();
  }
}

export default Renderer;
