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
    this.updated = false;

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

  // Recursively renders the whole tree
  renderTree(
    node = this.tree.root,
    parentX = node.x + this.canvas.width / 2 - this.tree.root.x,
    parentY = -Settings.constants.NODE_RADIUS
  ) {
    if (!node) return;

    // Calculate x and y position for rendering nodes
    const x = node.x + this.canvas.width / 2 - this.tree.root.x;
    const y = node.y + Settings.constants.OFFSET_Y;
    this.renderNode(node.data, x, y, parentX, parentY);

    if (node.left) this.renderTree(node.left, x, y);
    if (node.right) this.renderTree(node.right, x, y);
  }

  renderStats() {
    this.ctx.font = Settings.constants.STAT_FONT;
    this.ctx.fillStyle = Settings.constants.STAT_COLOR;
    this.ctx.textAlign = "left";

    // N elements
    this.ctx.fillText(
      "Number of elements: " + this.tree.length,
      Settings.constants.STAT_X,
      Settings.constants.OFFSET_Y
    );

    // Tree balance status
    this.ctx.fillText(
      "Balanced: " + this.tree.balanced(),
      Settings.constants.STAT_X,
      Settings.constants.OFFSET_Y + 20
    );
  }

  render() {
    if (this.tree.root === null) {
      // Clear if anything is drawn
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      return;
    }

    if (!this.updated) {
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if (this.camera.on) {
      this.camera.update();
      this.camera.move(this.ctx);
      this.renderTree();
      this.camera.reset(this.ctx);
    } else {
      this.renderTree();
    }
    this.updated = false;
    this.renderStats();
  }
}

export default Renderer;
