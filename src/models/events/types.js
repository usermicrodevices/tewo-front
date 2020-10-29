/* eslint class-methods-use-this: off */
import { observable, computed } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import { getEventTypes } from 'services/events';
import colorizedCell from 'elements/table/colorizedCell';

const declareColumns = () => ({
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'descend',
  },
  name: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Название',
    grow: 2,
    sortDirections: 'both',
    transform: (_, data, width) => colorizedCell({ children: data.name, color: data.color, width }),
  },
  reactionTimeText: {
    isVisibleByDefault: true,
    title: 'Время для отчета "просроченные задачи"',
    grow: 1,
    sortDirections: 'both',
  },
  priority: {
    isVisibleByDefault: true,
    title: 'Приоритет',
    grow: 1,
    sortDirections: 'both',
  },
  description: {
    isVisibleByDefault: true,
    title: 'Описание',
    grow: 3,
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

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
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
