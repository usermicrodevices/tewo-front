import { observable } from 'mobx';
import { getPackets } from 'services/packages';

class Packets extends Map {
  session;

  manager;

  constructor(session, manager) {
    super();
    this.session = session;
    this.manager = manager;
    getPackets(session, manager).then((packets) => {
      for (const packet of packets) {
        this.set(packet.id, packet);
      }
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
    const sessions = this.manager.sessions.getByDeviceId(deviceId);
    const packetsSet = new Set(sessions.map(({ packetId }) => packetId));
    return [...this.values()].filter(({ id }) => packetsSet.has(id));
  }
}

export default Packets;
