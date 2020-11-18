import { computed, observable } from 'mobx';

import { getNotificationTypes } from 'services/notifications';

class NotificationTypes {
  constructor() {
    this.map = observable.map();

    getNotificationTypes({
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
      value: item[1].value,
      name: item[1].name,
    }));
  }
}

export default NotificationTypes;
