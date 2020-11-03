import { computed } from 'mobx';
import { getEventPriorities } from 'services/events';

class EventPriorities extends Map {
  constructor() {
    super();
    getEventPriorities(this);
  }

  @computed get selector() {
    return [...this.entries()].map(([id, { description }]) => [id, description]);
  }
}

export default EventPriorities;
