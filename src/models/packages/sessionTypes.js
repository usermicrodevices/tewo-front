import { observable } from 'mobx';
import { getSessionTypes } from 'services/packages';

class SessionTypes extends observable.map {
  constructor() {
    super();
    getSessionTypes(this);
  }
}

export default SessionTypes;
