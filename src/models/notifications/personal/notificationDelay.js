import { computed, observable, action } from 'mobx';
import { message } from 'antd';

import { createNotificationDelay, updateNotificationDelay, deleteNotificationDelay } from 'services/notifications';

class NotificationDelay {
  id = null;

  source = null;

  @observable interval = null;

  constructor(id, source, interval) {
    this.id = id;
    this.source = source;
    this.interval = interval;
  }

  @computed get key() {
    return this.sourceId;
  }

  @computed get sourceId() {
    return this.source.id;
  }

  @computed get name() {
    return this.source.name;
  }

  @computed get minutes() {
    return this.interval ? Math.floor(this.interval / 60) : 0;
  }

  @action.bound setInterval(interval = 0) {
    this.interval = interval;

    if (this.id && interval === null) {
      deleteNotificationDelay({ id: this.id })
        .then(() => {
          this.id = null;

          message.success('Время оповещения сброшено!');
        });
    } else if (this.id) {
      updateNotificationDelay({ id: this.id, interval: this.interval, source: this.sourceId })
        .then((json) => {
          message.success('Время оповещения успешно обновлено!');
        });
    } else {
      createNotificationDelay({ interval: this.interval, source: this.sourceId })
        .then((response) => {
          this.id = response.id;

          message.success('Время оповещения успешно создано!');
        });
    }
  }
}

export default NotificationDelay;
