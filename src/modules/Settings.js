const Settings = (() => {
  // 90 % of window width
  const CANVAS_WIDTH = (90 / 100) * window.innerWidth;
  const CANVAS_HEIGHT = 700;

  // Node settings
  const NODE_RADIUS = 25;
  const BORDER_COLOR = "white";
  const NODE_COLOR = "green";

  // Data settings
  const DATA_COLOR = "white";
  const DATA_FONT = "12px Arial";

  // Stats settings
  const STAT_FONT = "15px Arial bold";
  const STAT_COLOR = "orange";
  const STAT_X = 50;

  // The factor by which the node positions are scaled
  const SCALE_X = 30;
  const SCALE_Y = 100;

  // The offset from the top of the canvas
  const OFFSET_Y = 50;

  // Offset to balance the text inside nodes
  const TEXT_OFFSET = 5;

  // 2pi radians for circle
  const MAX_RADIAN = 2 * Math.PI;

  // The padding around the tree
  const WORLD_PADDING = 50;

  // Number of frames to draw per second
  const FPS = 60;

  return {
    constants: {
      CANVAS_WIDTH,
      CANVAS_HEIGHT,
      NODE_RADIUS,
      SCALE_X,
      SCALE_Y,
      OFFSET_Y,
      TEXT_OFFSET,
      MAX_RADIAN,
      WORLD_PADDING,
      FPS,
      BORDER_COLOR,
      NODE_COLOR,
      DATA_COLOR,
      DATA_FONT,
      STAT_FONT,
      STAT_COLOR,
      STAT_X,
    },
  };
})();

export default Settings;
