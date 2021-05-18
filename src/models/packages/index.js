import { observable } from 'mobx';

import { postSession, cancelSession, getSession } from 'services/packages';

import Packets from './packets';
import Devices from './devices';
import PacketTypes from './packetTypes';
import SessionStatuses from './sessionStatuses';
import Sessions from './sessions';
import CreateSessionState from './createSessionState';
import DeviceStatuses from './deviceStatuses';

class DeviceUpdate {
  devices;

  packets;

  sessions;

  session;

  sessionStatuses = new SessionStatuses();

  packetTypes = new PacketTypes();

  deviceStatuses = new DeviceStatuses();

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

  cancelSession = cancelSession;

  getSession = getSession;
}

export default DeviceUpdate;
