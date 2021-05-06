import { observable } from 'mobx';

import { postSession } from 'services/packages';

import Packets from './packets';
import Devices from './devices';
import PacketTypes from './packetTypes';
import SessionStatuses from './sessionStatuses';
import Sessions from './sessions';
import CreateSessionState from './createSessionState';

class DeviceUpdate {
  devices;

  packets;

  sessions;

  session;

  sessionStatuses = new SessionStatuses();

  packetTypes = new PacketTypes();

  @observable newSession = null;

  constructor(session) {
    this.devices = new Devices(session, this);
    this.packets = new Packets(session, this);
    this.sessions = new Sessions(session, this);
    this.session = session;
  }

  createPackage() {
    this.newSession = new CreateSessionState(this.session);
  }

  submitNewSession = () => {
    postSession(this.newSession, this.session, this).then((createdSession) => {
      this.sessions.rawData.push(createdSession);
      this.clearNewSession();
    });
  }

  clearNewSession() {
    this.newSession = null;
  }
}

export default DeviceUpdate;
