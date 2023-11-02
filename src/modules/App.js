import Tree from "./Tree";
import Renderer from "./Renderer";
import EventHandler from "./EventHandler";
import Settings from "./Settings";
import { getRandom, isObjectEmpty } from "./utils";

// IIFE module that acts as a driver for all the rendering and updating of the tree
const App = (() => {
  let tree = null;
  let lastTreeState = null;
  let currentTreeState = null;

  let renderer = null;
  let animatorInterval = null;
  let animating = false;

  let animationSkipper = null;
  // Creates a new tree and and a new renderer for that tree
  // Then starts listening to inputs
  function init() {
    tree = new Tree();
    currentTreeState = tree.state;
    renderer = new Renderer();
    EventHandler.listen();
    render();
  }

  // Start keeps looping and updating the camera and rendering if anything has changed
  function start() {
    requestAnimationFrame(start);
    if (animating) {
      return;
    }
    renderer.camera.update();

    // If pressing movement key and the camera has moved
    if (
      (EventHandler.isKeyPressed("ArrowRight") ||
        EventHandler.isKeyPressed("ArrowLeft") ||
        EventHandler.isKeyPressed("ArrowUp") ||
        EventHandler.isKeyPressed("ArrowDown")) &&
      renderer.camera.hasMoved
    ) {
      render();
    }
  }

  function render(targetPos) {
    renderer.updated = true;
    renderer.updateWorldBounds(currentTreeState);
    renderer.render(currentTreeState, targetPos);
  }

  function animation(deleted) {
    return new Promise((resolve, reject) => {
      animationSkipper = resolve;
      animatorInterval = setInterval(() => {
        if (tree.recordStack.length === 0 || isObjectEmpty(lastTreeState)) {
          resolve();
          return;
        }

        const data = tree.recordStack.shift();

        const nodeInLast = lastTreeState.positions.nodes.find(
          (node) => node.data === data
        );
        nodeInLast.highlighted = true;

        if (nodeInLast.data === deleted) {
          nodeInLast.highlighted = false;
          nodeInLast.deleted = true;
        }

        render({ x: nodeInLast.x, y: nodeInLast.y });
      }, 500);
    });
  }

  function saveTreeState() {
    lastTreeState = Object.assign({}, tree.state);
  }

  async function beginAnimation(deleted) {
    animating = true;
    currentTreeState = lastTreeState;
    await animation(deleted, animationSkipper);
    clearInterval(animatorInterval);
    if (tree.recordStack.length && !isObjectEmpty(lastTreeState)) {
      const skipNode = tree.recordStack.pop();
      const nodeInLast = lastTreeState.positions.nodes.find(
        (node) => node.data === skipNode
      );
      render({ x: nodeInLast.x, y: nodeInLast.y });
      tree.clearRecords();
    }
    animating = false;
    currentTreeState = tree.state;
    render();
  }

  // Inserts a number in the tree and updates the screen
  function insertNumber(num) {
    if (tree.length >= Settings.constants.MAX_NODES) {
      //Cant insert
      alert("Reached Max number of nodes: " + Settings.constants.MAX_NODES);
      return;
    }
    // Save the last tree state
    saveTreeState();
    // Insert the number to tree
    tree.insert(num);
    beginAnimation();
  }

  // Deletes a number in the tree and updates the screen
  function deleteNumber(num) {
    if (tree.find(num) === null) {
      //Couldnt find the number
      alert("That number does not exist in the tree!");
      return;
    }

    saveTreeState();
    tree.delete(num);

    beginAnimation(num);
  }

  // Builds a new tree using the given data and updates the screen
  function buildTree(data) {
    tree.build(data);
    render();
  }

  // Creates a random array of data of n elements and overwrites the current tree
  function createRandom(n) {
    const data = [];
    for (let i = 0; i < n; ++i) {
      // Create a random number
      let randNum = getRandom(Settings.constants.MAX_N);

      // Check if its in data
      while (data.includes(randNum)) {
        // Its already in data therefore make a new one
        randNum = getRandom(Settings.constants.MAX_N);
        // Check if this is also in data and repeat
      }

      // Push the unique random number
      data.push(randNum);
    }
    buildTree(data);
  }

  function balance() {
    tree.rebalance();
    render();
  }

  function clear() {
    tree.clear();
    currentTreeState = tree.state;
    saveTreeState();
    renderer.centerCamera();
    render();
  }

  function traverse(type) {
    saveTreeState();
    tree.recordTraversal(type);
    beginAnimation();
  }

  function skipAnimation() {
    animationSkipper();
  }

  function isAnimating() {
    return animating;
  }

  return {
    init,
    start,
    buildTree,
    isAnimating,
    skipAnimation,
    insertNumber,
    deleteNumber,
    createRandom,
    clear,
    balance,
    traverse,
  };
})();

export default App;
