import { observable, reaction, computed } from 'mobx';

function applySort(data, sort) {
  const { column } = sort;
  const direction = sort.direction === 'descend' ? -1 : 1;
  return data.sort((a, b) => {
    const left = a[column];
    const right = b[column];
    if (left === right) {
      return Math.sign(a.id - b.id);
    }
    return (left > right ? 1 : -1) * direction;
  });
}

class StaticDataManager {
  @observable data = [];

  @observable amount;

  @computed get isLoaded() {
    return this.data.length === this.amount;
  }

  constructor(partialLoader, amount, data, table) {
    reaction(() => ({ data: this.data, sort: table.sort }), ({ data: unsorted, sort }) => {
      this.data.replace(applySort(unsorted.slice(), sort));
    });
    if (amount !== data.length) {
      partialLoader(amount, 0).then(({ count, results }) => {
        console.assert(count === amount);
        console.assert(results.length === amount);
        this.data.replace(results);
      });
    } else {
      this.data.replace(data);
    }
  }
}

export default StaticDataManager;
