import getOperations from 'services/operations';

class Operations extends Map {
  constructor() {
    super();

    getOperations(this);
  }

  getValue(id) {
    const op = this.get(id);
    if (typeof op === 'undefined') {
      return this.size > 0 ? null : undefined;
    }
    return op.value;
  }

  getDescription(id) {
    const op = this.get(id);
    if (typeof op === 'undefined') {
      return this.size > 0 ? null : undefined;
    }
    return op.description;
  }
}

export default Operations;
