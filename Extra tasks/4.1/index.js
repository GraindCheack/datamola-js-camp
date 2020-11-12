'use strict';

class Node {
  constructor(value, next = null) {
    this.next = next;
    this.value = value;
  }
}

class List {
  constructor(value) {
    this.root = new Node(value);
    this[Symbol.iterator] = function () {
      return {
        current: this.root,

        next() {
          if (this.current !== null) {
            const tempNode = this.current;
            this.current = this.current.next;
            return { done: false, value: tempNode };
          } else {
            return { done: true };
          }
        },
      };
    };
  }

  addNode(value, i) {
    let current = this.root;
    let index = 0;
    while (current?.next && i !== index++) {
      current = current?.next;
    }
    if (i > index - 1) return false;
    current.next = new Node(value, current.next);
    return true;
  }

  removeNode(i) {
    if (i === 0) {
      this.root = this.root.next;
      return true;
    }
    let current = this.root;
    let index = 1;
    while (current?.next.next && i !== index++) {
      current = current?.next;
    }
    if (i > index - 1) return false;
    current.next = current.next.next;
    return true;
  }

  print() {
    let result = '';
    for (const node of this) {
      result += node.value + ', ';
    }
    console.log(result);
  }
}

const nodesList = new List('Первое сообщение', Node);

nodesList.addNode('Второе сообщение');
nodesList.addNode('Третье сообщение');
nodesList.addNode('Четвертое сообщение');
nodesList.addNode('Пятое сообщение');
nodesList.addNode('Сообщение между 2 и 3', 1);
console.log(nodesList.addNode('Не добавится', 5));

for (const el of nodesList) {
  console.log(el);
}

nodesList.removeNode(2);
nodesList.removeNode(0);
nodesList.removeNode();
console.log(nodesList.removeNode(6));

for (const el of nodesList) {
  console.log(el);
} 

nodesList.print()
