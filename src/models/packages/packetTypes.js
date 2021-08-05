import { computed, observable } from 'mobx';
import { getPacketTypes } from 'services/packages';

class PacketTypes extends observable.map {
  constructor() {
    super();
    getPacketTypes(this);
  }
}

export default PacketTypes;
