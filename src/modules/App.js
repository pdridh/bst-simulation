import Tree from "./Tree";
import Renderer from "./Renderer";
import EventHandler from "./EventHandler";
import Settings from "./Settings";

// IIFE module that acts as a driver for all the rendering and updating of the tree
const App = (() => {
  let tree = null;
  let renderer = null;

  // Creates a new tree and and a new renderer for that tree
  // Then starts listening to inputs
  function init() {
    tree = new Tree();
    renderer = new Renderer(tree);
    EventHandler.listen();
    rerender();
  }

  // Start keeps looping and updating the camera and rendering if anything has changed
  function start() {
    renderer.camera.update();

    // If pressing movement key and the camera has moved
    if (
      (EventHandler.isKeyPressed("ArrowRight") ||
        EventHandler.isKeyPressed("ArrowLeft") ||
        EventHandler.isKeyPressed("ArrowUp") ||
        EventHandler.isKeyPressed("ArrowDown")) &&
      renderer.camera.hasMoved
    ) {
      renderer.updated = true;
      renderer.render();
    }

    requestAnimationFrame(start);
  }

  // Updates the renderer settings and sets drawing flag to true
  // By which the renderer then renders
  function rerender() {
    renderer.updateWorldBounds();
    renderer.updated = true;
    renderer.render();
  }

  // Inserts a number in the tree and updates the screen
  function insertNumber(num) {
    if (tree.length < Settings.constants.MAX_NODES) {
      tree.insert(num);
      rerender();
      return;
    }

    //Cant insert
    alert("Reached Max number of nodes: " + Settings.constants.MAX_NODES);
  }

  // Deletes a number in the tree and updates the screen
  function deleteNumber(num) {
    if (tree.find(num) === null) {
      //Couldnt find the number
      alert("That number does not exist in the tree!");
      return;
    }

    tree.delete(num);
    rerender();
  }

  // Builds a new tree using the given data and updates the screen
  function buildTree(data) {
    tree.build(data);
    rerender();
  }

  // Returns a random number(integer) from 1 to n (inclusive)
  function getRandom(n) {
    return Math.floor(Math.random() * n + 1);
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
    rerender();
  }

  return {
    init,
    start,
    buildTree,
    insertNumber,
    deleteNumber,
    createRandom,
    balance,
  };
})();

export default App;
