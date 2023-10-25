import App from "./App";

// Listens for inputs and then registers them
const EventHandler = (() => {
  let pressedKeys = [];
  const insertBtn = document.querySelector(".insert-btn");
  const insertInput = document.querySelector("#insert-input");

  const deleteBtn = document.querySelector(".delete-btn");
  const deleteInput = document.querySelector("#delete-input");

  const balanceBtn = document.querySelector(".balance-btn");

  // Registers the pressed key if it hasnt been registered
  function registerKeyDown(e) {
    if (pressedKeys.indexOf(e.key) < 0) pressedKeys.push(e.key);
  }

  // Removes the pressed key that has been registered by registerKeyDown after the key is up
  function registerKeyUp(e) {
    pressedKeys = pressedKeys.filter((key) => key !== e.key);
  }

  function handleInsertBtn(e) {
    const number = Number(insertInput.value);
    insertInput.value = "";

    App.insertNumber(number);
  }

  function handleDeleteBtn(e) {
    const number = Number(deleteInput.value);
    deleteInput.value = "";

    App.deleteNumber(number);
  }

  function handleBalanceBtn(e) {
    App.balance();
  }

  // Start listening to keydown and keyup events
  function listen() {
    window.addEventListener("keydown", registerKeyDown);
    window.addEventListener("keyup", registerKeyUp);
    insertBtn.addEventListener("click", handleInsertBtn);
    deleteBtn.addEventListener("click", handleDeleteBtn);
    balanceBtn.addEventListener("click", handleBalanceBtn);
  }

  // Returns true if the given key is pressed
  function isKeyPressed(key) {
    const index = pressedKeys.indexOf(key);
    return index >= 0;
  }

  return { isKeyPressed, listen };
})();

export default EventHandler;
