import { computed, observable } from 'mobx';
import Datum from 'models/datum';
import { humanizeSeconds } from 'utils/date';

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

  @computed get reactionTimeMinutes() {
    return this.reactionTime / 60;
  }

  set reactionTimeMinutes(v) {
    this.reactionTime = v * 60;
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
    reactionTimeMinutes: {
      type: 'miutes',
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
        dataIndex: 'reactionTimeMinutes',
        title: 'Время реакции',
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
