import { computed, observable } from 'mobx';
import Datum from 'models/datum';
import { humanizeSeconds } from 'utils/date';
import plural from 'utils/plural';

class EventType extends Datum {
  id;

  cid;

  @observable name;

  @observable reactionTime;

  @observable priorityId;

  @observable color;

  @observable description;

  isHidden;

  isOverdued;

  get key() { return this.id; }

  session;

  constructor(session) {
    super(session.eventTypes.update);

    this.session = session;
  }

  @computed get reactionTimeText() {
    return humanizeSeconds(this.reactionTime);
  }

  @computed get priority() {
    if (this.priorityId === null) {
      return null;
    }
    return this.session.eventPriorities.get(this.priorityId);
  }

  @computed get priorityDescription() {
    const { priority } = this;
    return priority ? priority.description : priority;
  }

  editable = {
    reactionTime: {
      type: 'minutes',
    },
    color: {
      type: 'color',
    },
  };

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
        value: this.reactionTimeText,
      },
      {
        dataIndex: 'priorityId',
        title: 'Приоритет',
        value: this.priorityDescription,
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
