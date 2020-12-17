import { reaction } from 'mobx';

import MapStorage from 'models/map';
import Filters from 'models/filters';

const declareFilters = (session) => ({
  id: {
    type: 'selector',
    title: 'Объекты',
    apply: (general, data) => general(data.id),
    selector: () => session.devices.selector,
  },
});

class MapWidget {
  generic;

  session;

  mapStorage;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;
    this.mapStorage = new MapStorage(session, new Filters(declareFilters(session)));

    this.update();
    reaction(() => this.generic.salePointsId, this.update);
  }

  update = () => {
    if (this.generic.salePointsId && this.generic.salePointsId.length) {
      this.mapStorage.filters.set('id', this.generic.salePointsId);
    } else {
      this.mapStorage.filters.clear();
    }
  }
}

export default MapWidget;
