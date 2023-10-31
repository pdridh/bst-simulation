// Utility for restricting a value in between min and max (inclusive)
function clamp(value, min, max) {
  if (value < min) return min;
  else if (value > max) return max;
  return value;
}

// Utility that checks if an object is emtpy
function isObjectEmpty(obj) {
  return JSON.stringify(obj) === "{}";
}

// Returns a random number(integer) from 1 to n (inclusive)
function getRandom(n) {
  return Math.floor(Math.random() * n + 1);
}

module.exports = {
  clamp,
  isObjectEmpty,
  getRandom,
};
