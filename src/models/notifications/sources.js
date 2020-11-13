import { computed, observable } from 'mobx';

import { getNotificationSources } from 'services/notifications';

class NotificationSources {
  constructor() {
    this.map = observable.map();

    getNotificationSources({
      set: (key, value) => {
        this.map.set(key, value);
      },
    });
  }

  get selector() {
    return [...this.map.entries()];
  }

  @computed get list() {
    return this.selector.map((item) => ({
      id: item[0],
      name: item[1].name,
      value: item[1].value,
    }));
  }
}

export default NotificationSources;
