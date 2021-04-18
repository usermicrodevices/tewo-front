import { observable } from 'mobx';

import { postPackage } from 'services/packages';

import Packets from './packets';
import Devices from './devices';
import PacketTypes from './packetTypes';
import SessionTypes from './sessionTypes';
import Sessions from './sessions';
import CreateSessionState from './createSessionState';

class DeviceUpdate {
  devices;

  packets;

  sessions;

  session;

  packetTypes = new PacketTypes();

  sessionTypes = new SessionTypes();

  @observable newSession = null;

  constructor(session) {
    this.devices = new Devices(session, this);
    this.packets = new Packets(session, this);
    this.sessions = new Sessions(session, this);
    this.session = session;
  }

  chreatePackage() {
    this.newSession = new CreateSessionState(this.session);
  }

  submitNewSession() {
    postPackage(this.newSession).then(() => {
      this.packages.rawData.push(this.newSession);
      this.clearNewSession();
    });
  }

  clearNewSession() {
    this.newSession = null;
  }
}

export default DeviceUpdate;
