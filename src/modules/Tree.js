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

    root.left = this.#buildTree(data, start, mid - 1);
    root.right = this.#buildTree(data, mid + 1, end);

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

  // Returns the found node with the given data
  // Returns null if node with the given data is not found
  find(data, node = this.root) {
    if (node === null || data === node.data) {
      return node;
    }

    if (data < node.data) {
      return this.find(data, node.left);
    }
    return this.find(data, node.right);
  }

  // Deletes the node with the given data
  // If the node has two children then its replaced with its inorder successor
  #deleteNode(data, root = this.root) {
    if (root === null) {
      return root;
    }

    if (data < root.data) {
      root.left = this.#deleteNode(data, root.left);
    } else if (data > root.data) {
      root.right = this.#deleteNode(data, root.right);
    } else {
      // This is the node to be deleted

      // Leaf node
      if (root.left === null && root.right === null) {
        return null;
      }

      // Single child case
      if (root.left === null) {
        return root.right;
      } else if (root.right == null) {
        return root.left;
      }

      // Two children case
      // Find the inorder successor(smallest value AFTER the target node)
      let successor = root.right;
      while (successor.left) {
        successor = successor.left;
      }
      // Replace the target node with the data
      root.data = successor.data;
      //Recursively delete the copied node (successor)
      root.right = this.#deleteNode(successor.data, root.right);
    }
    return root;
  }

  // Wrapper function for the recursive deleteNode
  delete(data) {
    this.root = this.#deleteNode(data, this.root);
  }

}

export default Tree;
