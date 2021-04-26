import { observable } from 'mobx';
import { getSessionStatuses } from 'services/packages';

class SessionStatuses extends observable.map {
  constructor() {
    super();
    getSessionStatuses(this);
  }
}

export default SessionStatuses;
