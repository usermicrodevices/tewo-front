import { observable } from 'mobx';

import { postPackage } from 'services/packages';

import Packets from './packets';
import Packet from './packet';
import Devices from './devices';
import PacketTypes from './packetTypes';
import SessionTypes from './sessionTypes';
import Sessions from './sessions';

class DeviceUpdate {
  devices;

  packets;

  sessions;

  session;

  packetTypes = new PacketTypes();

  sessionTypes = new SessionTypes();

  @observable newPacket = null;

  constructor(session) {
    this.devices = new Devices(session, this);
    this.packets = new Packets(session, this);
    this.sessions = new Sessions(session, this);
    this.session = session;
  }

  chreatePackage() {
    this.newPackage = new Packet(this.session);
  }

  submitNewPacket() {
    postPackage(this.newPackage).then(() => {
      this.packages.rawData.push(this.newPackage);
      this.clearNewPacket();
    });
  }

  clearNewPacket() {
    this.newPacket = null;
  }
}

export default DeviceUpdate;
