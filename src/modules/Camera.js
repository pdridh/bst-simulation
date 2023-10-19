import EventHandler from "./EventHandler";
import { clamp } from "./utils";

// Handles the translation of the context according to the given settings
class Camera {
  constructor(worldBounds, canvas) {
    // Target the center of the canvas
    this.targetX = canvas.width / 2;
    this.targetY = canvas.height / 2;

    // Flag to track if the camera should be used
    this.on = false;

    this.updateSettings(worldBounds, canvas);
    this.calibrate();

    // Start listening for events for movement
    EventHandler.listen();
  }

  // Updates the camera settings based on the given world and canvas
  updateSettings(worldBounds, canvas) {
    this.worldBounds = worldBounds;
    this.canvas = canvas;
    this.on =
      this.worldBounds.minX < 0 ||
      this.worldBounds.maxX > this.canvas.width ||
      this.worldBounds.minY < 0 ||
      this.worldBounds.maxY > this.canvas.width;
    this.speedX = (1 / 100) * worldBounds.maxX;
    this.speedY = (1 / 100) * worldBounds.maxY;
  }

  // Calibrates the canvas according to the target position
  calibrate() {
    this.x = clamp(
      this.targetX - this.canvas.width / 2,
      this.worldBounds.minX,
      this.worldBounds.maxX - this.canvas.width
    );
    this.y = clamp(
      this.targetY - this.canvas.height / 2,
      this.worldBounds.minY,
      this.worldBounds.maxY - this.canvas.height
    );
  }

  update() {
    if (EventHandler.isKeyPressed("ArrowRight")) {
      this.targetX += this.speedX;
    }

    if (EventHandler.isKeyPressed("ArrowLeft")) {
      this.targetX -= this.speedX;
    }

    if (EventHandler.isKeyPressed("ArrowUp")) {
      this.targetY -= this.speedY;
    }

    if (EventHandler.isKeyPressed("ArrowDown")) {
      this.targetY += this.speedY;
    }

    if (this.targetX - this.canvas.width / 2 < this.worldBounds.minX) {
      this.targetX = this.worldBounds.minX + this.canvas.width / 2;
    } else if (this.targetX + this.canvas.width / 2 > this.worldBounds.maxX) {
      this.targetX = this.worldBounds.maxX - this.canvas.width / 2;
    }

    if (this.targetY - this.canvas.height / 2 < 0) {
      this.targetY = this.canvas.height / 2;
    } else if (this.targetY + this.canvas.height / 2 > this.worldBounds.maxY) {
      this.targetY = this.worldBounds.maxY - this.canvas.height / 2;
    }

    this.calibrate();
  }

}

export default Camera;
