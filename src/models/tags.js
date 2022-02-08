import {
  computed, observable, action, transaction,
} from 'mobx';

import { getTags, addTag } from 'services/tags';

class Tags {
  data = observable.map();

  @observable loaded = false;

  constructor() {
    getTags().then((tags) => {
      transaction(() => {
        this.loaded = true;
        for (const tag of tags) {
          this.set(tag);
        }
      });
    });
  }

  get(id) {
    return this.data.get(id);
  }

  @action set(tag) {
    this.data.set(tag.id, { name: tag.name, weight: tag.weight, group: tag.group });
  }

  @action add(name) {
    return addTag({ name }).then((tag) => {
      this.set(tag);
      return tag;
    });
  }

  @computed get selector() {
    if (!this.loaded) {
      return undefined;
    }
    return [...this.data.entries()].map(([id, { name }]) => [id, name]).sort(([idA], [idB]) => idA - idB);
  }
}

export default Tags;
