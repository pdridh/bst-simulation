// Listens for inputs and then registers them
const EventHandler = (() => {
  let pressedKeys = [];

  // Registers the pressed key if it hasnt been registered
  function registerKeyDown(e) {
    if (pressedKeys.indexOf(e.key) < 0) pressedKeys.push(e.key);
  }

  // Removes the pressed key that has been registered by registerKeyDown after the key is up
  function registerKeyUp(e) {
    pressedKeys = pressedKeys.filter((key) => key !== e.key);
  }

  // Start listening to keydown and keyup events
  function listen() {
    window.addEventListener("keydown", registerKeyDown);
    window.addEventListener("keyup", registerKeyUp);
  }

  // Returns true if the given key is pressed
  function isKeyPressed(key) {
    const index = pressedKeys.indexOf(key);
    return index >= 0;
  }

  return { isKeyPressed, listen };
})();

export default EventHandler;
