import Node from "./Node";

class Tree {
  constructor(data) {
    this.root = null;
    if (data) {
      this.build(data);
    }
  }

  // Helper to filter the data
  #filterData(data) {
    const filtered = data.filter((val, ind) => data.indexOf(val) === ind);
    filtered.sort((a, b) => a - b);
    return filtered;
  }

  // Builds a balanced BST and returns the root node
  #buildTree(data, start = 0, end = data.length - 1) {
    if (start > end) return null;

    const mid = Math.floor((start + end) / 2);
    const root = new Node(data[mid]);

    root.left = this.buildTree(data, start, mid - 1);
    root.right = this.buildTree(data, mid + 1, end);

    return root;
  }

  // Sanitizes the given data and builds the tree
  build(data) {
    data = this.#filterData(data);
    this.root = this.#buildTree(data);
  }

  // Insert a new node with the given data if it doesn't exist
  insert(data, node = this.root) {
    if (node === null) {
      node = new Node(data);
      return node;
    }

    if (data < node.data) {
      node.left = this.insert(data, node.left);
    } else {
      node.right = this.insert(data, node.right);
    }

    return node;
  }

}

export default Tree;
