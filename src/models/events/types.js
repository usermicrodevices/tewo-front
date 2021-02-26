/* eslint class-methods-use-this: off */
import { observable, computed } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import { getEventTypes, patchCustomEventType } from 'services/events';
import colorizedCell from 'elements/table/colorizedCell';

const declareColumns = () => ({
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'both',
  },
  name: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Название',
    grow: 2,
    sortDirections: 'both',
  },
  reactionTime: {
    isVisibleByDefault: true,
    title: 'Время реакции',
    grow: 1,
    sortDirections: 'both',
    transform: (_, { reactionTimeText }) => reactionTimeText,
  },
  priorityDescription: {
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

  constructor(session) {
    const columns = declareColumns();
    columns.name.transform = (_, data, width) => colorizedCell({
      children:
      data.name,
      color: data.color,
      width,
      onClick: () => this.actions.onEdit(data),
    });
    super(columns, getEventTypes(session), new Filters({}));
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

  update = patchCustomEventType;
}

export default EventTypes;
