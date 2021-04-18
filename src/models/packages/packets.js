import { observable, transaction } from 'mobx';
import { getPackets } from 'services/packages';

class Packets {
  session;

  manager;

  @observable isLoaded = false;

  data = observable.map();

  constructor(session, manager) {
    this.session = session;
    this.manager = manager;
    getPackets(session, manager).then((packets) => {
      transaction(() => {
        this.isLoaded = true;
        for (const packet of packets) {
          this.data.set(packet.id, packet);
        }
      });
    });
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
}

export default Packets;
