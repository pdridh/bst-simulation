import Camera from "./Camera";
import Settings from "./Settings";

import { isObjectEmpty } from "./utils";

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

    this.camera = new Camera(this.worldBounds, this.canvas);

    // For capping fps
    this.fps = Settings.constants.FPS;
    this.fpsInterval = 1000 / this.fps;
    this.then = Date.now();
    this.elapsed = null;
  }

  // Calculate the constraints for the Camera based on the current tree boundingBox
  updateWorldBounds(state) {
    if (isObjectEmpty(state)) {
      return;
    }

    const bbox = state.boundingBox;

    this.worldBounds.minX = Math.min(
      0,
      bbox.x + this.canvas.width / 2 - state.rootPosition.x
    );

    this.worldBounds.maxX = Math.max(
      this.canvas.width,
      bbox.w + this.canvas.width / 2 - state.rootPosition.x
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

  clearCanvas() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    this.ctx.fillStyle = Settings.constants.CANVAS_COLOR;
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Render a node using its x and y positions
  // Also render its edge to connect to its parent
  renderNode(node) {
    // Draw circle
    let color;
    if (node.highlighted) {
      color = "red";
    }
    this.ctx.fillStyle = color || Settings.constants.NODE_COLOR;
    this.ctx.beginPath();
    this.ctx.arc(
      node.x,
      node.y,
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
    this.ctx.fillText(
      node.data,
      node.x,
      node.y + Settings.constants.TEXT_OFFSET
    );
  }

  renderEdge(edge) {
    // Edges
    this.ctx.lineWidth = 2.5;
    this.ctx.strokeStyle = Settings.constants.BORDER_COLOR;
    this.ctx.beginPath();
    this.ctx.moveTo(edge.x1, edge.y1);
    this.ctx.lineTo(edge.x2, edge.y2);
    this.ctx.stroke();
  }

  // Render the whole tree
  renderTree(state) {
    const nodes = state.positions.nodes;
    const edges = state.positions.edges;

    edges.forEach((edge) => {
      const offsetEdge = {};
      offsetEdge.x1 = edge.x1 + this.canvas.width / 2 - state.rootPosition.x;
      offsetEdge.y1 = edge.y1 + Settings.constants.OFFSET_Y;
      offsetEdge.x2 = edge.x2 + this.canvas.width / 2 - state.rootPosition.x;
      offsetEdge.y2 = edge.y2 + Settings.constants.OFFSET_Y;
      this.renderEdge(offsetEdge);
    });
    nodes.forEach((node) => {
      const offsetNode = {};
      offsetNode.highlighted = node.highlighted;
      offsetNode.data = node.data;
      offsetNode.x = node.x + this.canvas.width / 2 - state.rootPosition.x;
      offsetNode.y = node.y + Settings.constants.OFFSET_Y;
      this.renderNode(offsetNode);
    });
  }

  renderStats(state) {
    this.ctx.font = Settings.constants.STAT_FONT;
    this.ctx.fillStyle = Settings.constants.STAT_COLOR;
    this.ctx.textAlign = "left";

    // N elements
    this.ctx.fillText(
      "Number of elements: " + state.length,
      Settings.constants.STAT_X,
      Settings.constants.OFFSET_Y
    );

    // Tree balance status
    this.ctx.fillText(
      "Balanced: " + state.balanced,
      Settings.constants.STAT_X,
      Settings.constants.OFFSET_Y + 20
    );
  }

  render(state) {
    if (isObjectEmpty(state)) {
      // Clear if anything is drawn
      this.clearCanvas();
      return;
    }

    if (!this.updated) {
      return;
    }

    this.clearCanvas();
    if (this.camera.on) {
      this.camera.update();
      this.camera.move(this.ctx);
      this.renderTree(state);
      this.camera.reset(this.ctx);
    } else {
      this.renderTree(state);
    }
    this.updated = false;
    this.renderStats(state);
  }
}

export default Renderer;
