class NodeList {
    constructor(char, appearances_count, zero_node, one_node) {
      this.char = char;
      this.appearances_count = appearances_count;
      this.zero_node = zero_node;
      this.one_node = one_node;
    }
  }
  
  class Heap {
    constructor(node_list) {
      this.value = [];
      
      for (const node of node_list) {
        this.push(node);
      }
    }
    
    push(node) {
      this.value.push(node);
  
      let child = this.value.length - 1;
      let parent = Math.ceil(child / 2) - 1;
      
      // 昇順になるように
      while (0 <= parent && this.value[child].appearances_count < this.value[parent].appearances_count) {
        const tmp = this.value[child];
        this.value[child] = this.value[parent];
        this.value[parent] = tmp;
        
        child = parent;
        parent = Math.ceil(child / 2) - 1;
      } 
    }
    
    pop() {
      if (this.size() === 1) {
        return this.value.pop();
      }
      
      const top = this.value[0];
      this.value[0] = this.value.pop();
      
      let parent = 0;
      while (2 * parent + 1 < this.value.length) {
        const left_child = 2 * parent + 1;
        const right_child = 2 * parent + 2;
      
        let child;
        if (this.value[right_child] === undefined || this.value[left_child].appearances_count < this.value[right_child].appearances_count) {
          child = left_child;
        } else {
          child = right_child;
        }
      
        if (this.value[child].appearances_count < this.value[parent].appearances_count) {
          const tmp = this.value[child];
          this.value[child] = this.value[parent];
          this.value[parent] = tmp;
        } else {
          break;
        }
        parent = child;
      }
      return top;
    }
    
    size() {
      return this.value.length;
    }
    
  }
  
  function main(input) {
    let backet = {};
    for (let i = 0;i < input.length;i++) {
      backet[input[i]] = backet[input[i]] ? backet[input[i]] + 1 : 1;
    }
    
    let list = [];
    Object.keys(backet).forEach(char => {
      list.push(new NodeList(char, backet[char], undefined, undefined));
    });
    
    const h = new Heap(list);
    if (h.size() === 1) {
      console.log("0".repeat(h.pop().appearances_count));
      return;
    }
    
    while (1 < h.size()) {
      const zero_node = h.pop();
      const one_node = h.pop();
      const parent_node = new NodeList(undefined, zero_node.appearances_count + one_node.appearances_count, zero_node, one_node);
      h.push(parent_node);
    }
    
    const tree = h.pop();
    const code_map = {};
    mapping(tree ,code_map, "");
    
    let result = "";
    for (let i = 0;i < input.length;i++) {
      result += code_map[input[i]];
    }
    console.log(result);
  }
  
  function mapping(node, code_map, code) {
    // ノードが根ならば
    if (node.char !== undefined) {
      code_map[node.char] = code;
    } else {
      mapping(node.zero_node, code_map, code + "0");
      mapping(node.one_node, code_map, code + "1");
    } 
  }
  
  const input = "aaabbcccdeeeffg";
  main(input.split(''));