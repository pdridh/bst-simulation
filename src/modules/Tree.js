import Node from "./Node";
import Settings from "./Settings";

class Tree {
  constructor(data) {
    this.root = null;

    // For recording the traversals
    this.clearRecords();

    // for drawing
    this.state = {};
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

  // Assign a position to each node in in-order to avoid overlaps
  assignNodePositions() {
    let x = 0;

    function assignPosition(node, depth) {
      if (node === null) {
        return;
      }
      assignPosition(node.left, depth + 1);
      node.x = x++ * Settings.constants.SCALE_X;
      node.y = depth * Settings.constants.SCALE_Y;
      assignPosition(node.right, depth + 1);
    }

    assignPosition(this.root, 0);
  }

  // Get the left most node of the tree
  getLeftMost(node) {
    if (node.left === null) {
      return node;
    }

    return this.getLeftMost(node.left);
  }

  // Get the right most node of the tree
  getRightMost(node) {
    if (node.right === null) {
      return node;
    }

    return this.getRightMost(node.right);
  }

  // Update the bounding box of the tree for calculating bounds
  updateBoundingBox() {
    const leftMost = this.getLeftMost(this.root);
    const rightMost = this.getRightMost(this.root);
    const top = this.root;
    let bottom;
    this.inOrder((node) => {
      if (this.depth(node) === this.height()) {
        bottom = node;
      }
    });

    this.state.boundingBox = {};
    this.state.boundingBox.x = leftMost.x - Settings.constants.NODE_RADIUS;
    this.state.boundingBox.y = top.y - Settings.constants.NODE_RADIUS;
    this.state.boundingBox.w = rightMost.x + Settings.constants.NODE_RADIUS;
    this.state.boundingBox.h = bottom.y + Settings.constants.NODE_RADIUS;
    this.state.boundingBox.area =
      (this.state.boundingBox.w - this.state.boundingBox.x) *
      (this.state.boundingBox.h - this.state.boundingBox.y);
  }

  calculateNodesAndEdges(
    node = this.root,
    positions = {
      nodes: [],
      edges: [],
    },
    parent = { x: this.root.x, y: -Settings.constants.NODE_RADIUS * 3 }
  ) {
    if (node === null) {
      return;
    }

    positions.nodes.push(Object.assign({}, node));
    positions.edges.push({
      x1: node.x,
      y1: node.y,
      x2: parent.x,
      y2: parent.y,
    });

    if (node.left) this.calculateNodesAndEdges(node.left, positions, node);
    if (node.right) this.calculateNodesAndEdges(node.right, positions, node);

    return positions;
  }

  // Update all tree settings
  updateTreeSettings() {
    if (this.root === null) {
      return;
    }
    this.assignNodePositions();
    this.updateBoundingBox();

    this.state.positions = this.calculateNodesAndEdges();
    this.state.rootPosition = { x: this.root.x, y: this.root.y };
    this.state.balanced = this.balanced();
    this.state.length = this.length;
  }

  // Sanitizes the given data and builds the tree
  build(data) {
    data = this.#filterData(data);
    this.root = this.#buildTree(data);
    this.updateTreeSettings();
  }

  clearRecords() {
    this.recordStack = [];
  }

  // Clears the tree and its state completely
  clear() {
    this.root = null;
    this.state = {};
    this.clearRecords();
  }

  // Insert a new node with the given data if it doesn't exist
  #insertNode(data, node) {
    if (node === null) {
      node = new Node(data);
      return node;
    }

    this.recordStack.push(node.data);
    if (data < node.data) {
      node.left = this.#insertNode(data, node.left);
    } else if (data > node.data) {
      node.right = this.#insertNode(data, node.right);
    }

    return node;
  }

  // Wrapper for recursive insertion
  insert(data) {
    if (this.root === null) {
      this.build([data]);
    }
    this.#insertNode(data, this.root);
    this.updateTreeSettings();
  }

  // Returns the found node with the given data
  // Returns null if node with the given data is not found
  #findNode(data, node) {
    if (node === null || data === node.data) {
      return node;
    }

    if (data < node.data) {
      return this.#findNode(data, node.left);
    }
    return this.#findNode(data, node.right);
  }

  // Wrapper for recursive find
  find(data) {
    return this.#findNode(data, this.root);
  }

  // Deletes the node with the given data
  // If the node has two children then its replaced with its inorder successor
  #deleteNode(data, node) {
    if (node === null) {
      return node;
    }

    this.recordStack.push(node.data);

    if (data < node.data) {
      node.left = this.#deleteNode(data, node.left);
    } else if (data > node.data) {
      node.right = this.#deleteNode(data, node.right);
    } else {
      // This is the node to be deleted

      // Leaf node
      if (node.left === null && node.right === null) {
        return null;
      }

      // Single child case
      if (node.left === null) {
        return node.right;
      } else if (node.right === null) {
        return node.left;
      }

      // Two children case
      // Find the inorder successor(smallest value AFTER the target node)
      let successor = node.right;
      while (successor.left) {
        successor = successor.left;
      }
      // Replace the target node with the data
      node.data = successor.data;
      //Recursively delete the copied node (successor)
      node.right = this.#deleteNode(successor.data, node.right);
    }
    return node;
  }

  // Wrapper function for the recursive deletion
  delete(data) {
    this.root = this.#deleteNode(data, this.root);
    if (this.root === null) {
      this.clear();
    }
    this.updateTreeSettings();
  }

  // Level order traverses the tree prioritizing level/breadth
  // Every node first gets visited and it's children are then enqued
  // If a callback is provided it is called when the node is visited
  #levelOrder(callback, queue, arr = []) {
    if (queue.length === 0) {
      return;
    }

    // Visit node and then deque it
    const node = queue.shift();
    if (callback) callback(node);
    arr.push(node.data);

    // Enque children nodes (discover) before visiting the next node in the queue
    if (node.left) queue.push(node.left);
    if (node.right) queue.push(node.right);
    this.#levelOrder(callback, queue, arr);

    return arr;
  }

  // Public wrapper for level order traversal
  // Accepts a callback that is called for each node
  // Returns an array with values in level order
  levelOrder(callback) {
    const queue = [this.root];
    return this.#levelOrder(callback, queue);
  }

  // Traverses the tree in order
  // Visits node in Left-Root-Right pattern
  #inOrder(callback, node, arr = []) {
    if (node === null) {
      return;
    }

    this.#inOrder(callback, node.left, arr);
    if (callback) callback(node);
    arr.push(node.data);
    this.#inOrder(callback, node.right, arr);

    return arr;
  }

  // Wrapper for recursive inOrder()
  // Accepts a callback that is called for each node visited in order
  // Returns an array with values in order
  inOrder(callback) {
    return this.#inOrder(callback, this.root);
  }

  recordTraversal(type) {
    if (!this.root) {
      return;
    }

    switch (type) {
      case "level":
        this.recordStack = this.levelOrder();
        break;
      case "in":
        this.recordStack = this.inOrder();
        break;
      case "pre":
        this.recordStack = this.preOrder();
        break;
      case "post":
        this.recordStack = this.postOrder();
        break;
    }

    this.updateTreeSettings();
  }

  // Traverses the tree in pre-order
  // Visits node in Root-Left-Right pattern
  #preOrder(callback, node, arr = []) {
    if (node === null) {
      return arr;
    }

    if (callback) callback(node);
    arr.push(node.data);
    arr = this.#preOrder(callback, node.left, arr);
    arr = this.#preOrder(callback, node.right, arr);

    return arr;
  }

  // Wrapper for recursive preOrder()
  // Accepts a callback that is called for each node visited in pre-order
  // Returns an array with values in pre-order
  preOrder(callback) {
    return this.#preOrder(callback, this.root);
  }

  // Traverses the tree in post-order
  // Visits node in Left-Right-Root pattern
  #postOrder(callback, node, arr = []) {
    if (node == null) {
      return arr;
    }

    arr = this.#postOrder(callback, node.left, arr);
    arr = this.#postOrder(callback, node.right, arr);
    if (callback) callback(node);
    arr.push(node.data);

    return arr;
  }

  // Wrapper for recursive postOrder()
  // Accepts a callback that is called for each node visited in post-order
  // Returns an array with values in post-order
  postOrder(callback) {
    return this.#postOrder(callback, this.root);
  }

  // Returns the height of the node i.e the number of edges from the given node to an accessible leaf node
  // Returns the height of the tree by default
  height(node = this.root) {
    if (node === null) return -1; // Offset the "null node"

    let left = this.height(node.left);
    let right = this.height(node.right);

    return Math.max(left, right) + 1;
  }

  // Returns the depth of the node i.e the distance from the root of the tree to that particular node.
  // Returns -1 if the data is not found
  #depth(target = this.root.data, traverseNode = this.root, depth = 0) {
    if (traverseNode === null) {
      return -1;
    }

    if (traverseNode.data === target) {
      return depth;
    }

    const left = this.#depth(target, traverseNode.left, depth + 1);
    const right = this.#depth(target, traverseNode.right, depth + 1);

    return Math.max(left, right);
  }

  // Public wrapper function for the recursive depth function
  // Accepts either the node or data as input
  // Returns -1 if node/data is not found
  depth(targetNode) {
    if (targetNode instanceof Node) {
      return this.#depth(targetNode.data);
    }
    return this.#depth(targetNode);
  }

  // A balanced tree is one where the difference between heights of left subtree and right subtree of every node is not more than 1
  // balanced() compares the height of the left subtree and right subtree and determines whether the tree is balanced
  balanced() {
    const leftHeight = this.height(this.root.left);
    const rightHeight = this.height(this.root.right);

    const diff = Math.abs(leftHeight - rightHeight);

    return !(diff > 1);
  }

  // Return the number of elements of the tree
  get length() {
    if (!this.inOrder()) return 0;
    return this.inOrder().length;
  }

  // Traverses the current tree in order and then replaces the tree with a new balanced
  rebalance() {
    if (this.root === null || this.balanced()) {
      return;
    }

    const arr = this.inOrder();
    this.root = this.#buildTree(arr);
    this.updateTreeSettings();
  }
}

export default Tree;
