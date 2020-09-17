import { computed, observable } from 'mobx';
import Datum from 'models/datum';
import { humanizeSeconds } from 'utils/date';

class EventType extends Datum {
  id;

  cid;

  @observable name;

  @observable reactionTime;

  @observable priority;

  @observable color;

  @observable description;

  isOverdued;

  get key() { return this.id; }

  constructor(session) {
    super(() => new Promise((resolve) => {
      setTimeout(resolve, 2000);
    }));

    this.session = session;
  }

  @computed get reactionTimeText() {
    return humanizeSeconds(this.reactionTime * 60);
  }

  editable = {
    name: {
      type: 'text',
    },
    reactionTime: {
      type: 'number',
    },
    priority: {
      type: 'number',
    },
    color: {
      type: 'color',
    },
    description: {
      type: 'text',
      rows: 4,
    },
  }

  @computed get values() {
    return [
      {
        dataIndex: 'id',
        title: 'ID',
        value: this.id,
      },
      {
        dataIndex: 'name',
        title: 'Название',
        value: this.name,
      },
      {
        dataIndex: 'reactionTime',
        title: 'Время для отчета "просроченные задачи"',
        value: this.reactionTime,
      },
      {
        dataIndex: 'priority',
        title: 'Приоритет',
        value: this.priority,
      },
      {
        dataIndex: 'color',
        title: 'Цвет',
        value: this.color,
      },
      {
        dataIndex: 'description',
        title: 'Описание',
        value: this.description,
      },
    ];
  }
}

export default EventType;
