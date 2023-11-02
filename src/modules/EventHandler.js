import App from "./App";
import Settings from "./Settings";

// Listens for inputs and then registers them
const EventHandler = (() => {
  let pressedKeys = [];

  const canvas = document.querySelector("#canvas");

  const createBtn = document.querySelector(".create-btn");
  const arrayInput = document.querySelector("#array-input");

  const insertBtn = document.querySelector(".insert-btn");
  const insertInput = document.querySelector("#insert-input");

  const deleteBtn = document.querySelector(".delete-btn");
  const deleteInput = document.querySelector("#delete-input");

  const randomBtn = document.querySelector(".random-btn");
  const randomInput = document.querySelector("#random-input");

  const recenterBtn = document.querySelector(".recenter-btn");
  const clearBtn = document.querySelector(".clear-btn");
  const balanceBtn = document.querySelector(".balance-btn");

  const levelOrderBtn = document.querySelector(".level-order-btn");
  const inorderBtn = document.querySelector(".inorder-btn");
  const preorderBtn = document.querySelector(".preorder-btn");
  const postorderBtn = document.querySelector(".postorder-btn");

  // Registers the pressed key if it hasnt been registered
  function registerKeyDown(e) {
    if (pressedKeys.indexOf(e.key) < 0) pressedKeys.push(e.key);
  }

  // Removes the pressed key that has been registered by registerKeyDown after the key is up
  function registerKeyUp(e) {
    pressedKeys = pressedKeys.filter((key) => key !== e.key);
  }

  function handleCreateBtn(e) {
    if (App.isAnimating()) {
      return;
    }

    if (arrayInput.value === "") {
      alert("Please enter the elements to create tree with");
      return;
    }

    // Split the string input into array
    // Convert strings to number
    // If not convertable then filter it
    const array = arrayInput.value
      .split(" ")
      .map((input) => {
        return Number(input);
      })
      .filter((n) => n !== NaN);
    arrayInput.value = "";

    if (array.length < Settings.constants.MAX_NODES) App.buildTree(array);
  }

  function handleInsertBtn(e) {
    if (App.isAnimating()) {
      return;
    }

    if (insertInput.value === "") {
      alert("Please enter an element to insert");
      return;
    }

    const number = Number(insertInput.value);

    if (number === NaN) {
      alert("Enter a valid number");
      return;
    }

    insertInput.value = "";
    App.insertNumber(number);
  }

  function handleDeleteBtn(e) {
    if (App.isAnimating()) {
      return;
    }

    if (deleteInput.value === "") {
      alert("Please enter an element to delete");
      return;
    }

    const number = Number(deleteInput.value);

    if (number === NaN) {
      alert("Enter a valid number");
      return;
    }

    deleteInput.value = "";

    App.deleteNumber(number);
  }

  function handleRandomBtn(e) {
    if (App.isAnimating()) {
      return;
    }

    //if its empty alert the user
    if (randomInput.value === "") {
      alert("Please enter the number of elements to create random tree");
      return;
    }

    let randN = Number(randomInput.value);
    if (randN > Settings.constants.MAX_NODES) {
      randomInput.value = Settings.constants.MAX_NODES;
      alert("Max number of nodes is " + Settings.constants.MAX_NODES);
      return;
    }

    randomInput.value = "";
    App.createRandom(randN);
  }

  function handleClearBtn(e) {
    if (App.isAnimating()) {
      return;
    }

    App.clear();
  }

  function handleBalanceBtn(e) {
    if (App.isAnimating()) {
      return;
    }

    App.balance();
  }

  function handleTraversalBtn(e) {
    if (App.isAnimating()) {
      return;
    }

    App.traverse(e.currentTarget.dataset.type);
  }

  function handleCanvasClick(e) {
    if (App.isAnimating()) App.skipAnimation();
  }

  function handleRecenterBtn(e) {
    if (App.isAnimating()) {
      return;
    }

    App.recenter();
  }

  // Start listening to keydown and keyup events
  function listen() {
    window.addEventListener("keydown", registerKeyDown);
    window.addEventListener("keyup", registerKeyUp);
    canvas.addEventListener("click", handleCanvasClick);
    insertBtn.addEventListener("click", handleInsertBtn);
    deleteBtn.addEventListener("click", handleDeleteBtn);
    balanceBtn.addEventListener("click", handleBalanceBtn);
    randomBtn.addEventListener("click", handleRandomBtn);
    recenterBtn.addEventListener("click", handleRecenterBtn);
    clearBtn.addEventListener("click", handleClearBtn);
    createBtn.addEventListener("click", handleCreateBtn);
    inorderBtn.addEventListener("click", handleTraversalBtn);
    levelOrderBtn.addEventListener("click", handleTraversalBtn);
    preorderBtn.addEventListener("click", handleTraversalBtn);
    postorderBtn.addEventListener("click", handleTraversalBtn);
  }

  // Returns true if the given key is pressed
  function isKeyPressed(key) {
    const index = pressedKeys.indexOf(key);
    return index >= 0;
  }

  return { isKeyPressed, listen };
})();

export default EventHandler;
