/* eslint class-methods-use-this: "off" */
import { observable } from 'mobx';

import plural from 'utils/plural';
import Table from 'models/table';
import Filters from 'models/filters';
import { getEventTypes } from 'services/events';

const declareColumns = () => ({
  id: {
    isVisbleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'descend',
  },
  name: {
    isDefaultSort: true,
    isVisbleByDefault: true,
    title: 'Название',
    grow: 3,
    sortDirections: 'both',
  },
  reactionTime: {
    isVisbleByDefault: true,
    title: 'Время реакции руководителя',
    grow: 3,
    sortDirections: 'both',
    transform: (value) => (typeof value === 'number' ? `${value} ${plural(value, ['минуту', 'минут', 'минуты'])}` : value),
  },
  priority: {
    isVisbleByDefault: true,
    title: 'Приоритет',
    grow: 2,
    sortDirections: 'both',
  },
});

class EventTypes extends Table {
  chart = null;

  @observable elementForEdit;

  get isImpossibleToBeAsync() { return true; }

  actions = {
    isVisible: true,
    isEditable: () => true,
    onEdit: (datum) => {
      this.elementForEdit = datum;
    },
  };

  constructor() {
    super(declareColumns(), getEventTypes, new Filters({}));
  }

  toString() {
    return 'EventTypes';
  }

  get selector() {
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  get prioritySelector() {
    return this.rawData
      .filter(({ priority }) => priority !== null)
      .map(({ id, priority }) => [id, priority]);
  }

  get(typeId) {
    return this.rawData.find(({ id }) => id === typeId);
  }
}

export default EventTypes;
