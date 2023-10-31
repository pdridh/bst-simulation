class Node {
  constructor(data = null, left = null, right = null) {
    this.data = data;
    this.left = left;
    this.right = right;

    //for drwaing
    this.x = 0;
    this.y = 0;
    this.highlighted = false;
  }
}

export default Node;
