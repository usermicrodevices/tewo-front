import { observable, transaction, computed } from 'mobx';
import { getPackets } from 'services/packages';
import Filter from 'models/filters';

const declareFilters = (manager) => ({
  typeId: {
    type: 'selector',
    title: 'Тип',
    apply: (general, data) => general(data.typeId),
    selector: () => [...manager.packetTypes.values()].map(({ id, name }) => [id, name]),
  },
});
class Packets {
  session;

  manager;

  @observable isLoaded = false;

  data = observable.map();

  filter;

  constructor(session, manager) {
    this.session = session;
    this.manager = manager;
    this.filter = new Filter(declareFilters(manager));
    getPackets(session, manager).then((packets) => {
      transaction(() => {
        this.isLoaded = true;
        for (const packet of packets) {
          this.data.set(packet.id, packet);
        }
      });
    });
  }

  @computed get dataSource() {
    return [...this.data.values()].filter(this.filter.predicate).map(({
      id,
      name,
      version,
      typeId,
    }) => ({
      key: id,
      id,
      name,
      version,
      typeName: this.manager.packetTypes.get(typeId)?.name,
    }));
  }

  getType(packetId) {
    const packet = this.get(packetId);
    if (!packet) {
      return packet;
    }
    return this.manager.packetTypes.get(packet.typeId);
  }

  getByDeviceId(deviceId) {
    if (!this.isLoaded) {
      return undefined;
    }
    return [...this.data.values()].filter(
      ({ sessions }) => new Set([].concat(...sessions.map(({ devicesId }) => [...devicesId.values()]))).has(deviceId),
    );
  }

  get(packetId) {
    return this.data.get(packetId);
  }

  @computed get selector() {
    return [...this.data.values()].map(({ id, name }) => [id, name]);
  }
}

export default Packets;
