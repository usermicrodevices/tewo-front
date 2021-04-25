import { transaction, when } from 'mobx';
import {
  get, patch, post,
} from 'utils/request';
import moment from 'moment';
import checkData from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';
import Packet from 'models/packages/packet';
import DeviceSession from 'models/packages/session';
import Device from 'models/packages/device';

const RENAMER = {
  id: 'id',
  name: 'name',
  description: 'description',
  file: 'file',
  packet_type: 'typeId',
  version: 'version',
};

const transformSession = (session, manager) => (v) => {
  checkData(v, {
    created_at: 'date',
    description: 'string',
    devices: 'array',
    id: 'number',
    name: 'string',
    packet: 'number',
  }, {
    updated_at: 'date',
  });
  return new DeviceSession({
    id: v.id,
    name: v.name,
    description: v.description,
    devices: v.devices,
    packetId: v.packet,
    created: moment(v.created_at),
    updated: v.updated_at ? moment(v.updated_at) : null,
  }, session, manager);
};

const getSessions = (session, manager) => () => get('/local_api/sessions/').then((json) => {
  if (!Array.isArray(json)) {
    apiCheckConsole.warn('packets array expected');
    return [];
  }
  const results = json.map(transformSession(session, manager));
  return { results, count: results.length };
});

const getPackets = (session, manager) => get('/local_api/packets/').then((json) => {
  if (!Array.isArray(json)) {
    apiCheckConsole.warn('packets array expected');
    return [];
  }
  return json.map((v) => {
    checkData(v, {
      id: 'number',
      name: 'string',
      description: 'string',
      file: 'string',
      packet_type: 'number',
    }, {
      version: 'object',
    });
    return new Packet(Object.fromEntries(Object.entries(v).map(([key, val]) => [RENAMER[key], val])), session, manager);
  });
});

const getPacketTypes = (acceptor) => get('/local_api/packet_types/').then((json) => {
  if (!Array.isArray(json)) {
    apiCheckConsole.warn('packet types array expected');
    return;
  }
  transaction(() => {
    for (const type of json) {
      checkData(type, {
        id: 'number',
        name: 'string',
        description: 'string',
      });
      acceptor.set(type.id, type);
    }
  });
});

const getDevices = (session, manager) => () => when(() => session.devices.isLoaded).then(() => ({
  count: session.devices.rawData.length,
  results: session.devices.rawData.map((device) => new Device(device, session, manager)),
}));

const postSession = (data, session, manager) => post('/local_api/sessions', {
  name: data.name,
  description: data.description,
  packet: data.packet,
  devices: [...data.devices.values()].map((device) => ({ device })),
}).then(transformSession(session, manager));

const getSessionStatuses = (acceptor) => get('/local_api/session_statuses/').then((json) => {
  if (!Array.isArray(json)) {
    apiCheckConsole.warn('/local_api/session_statuses array expected');
    return;
  }
  transaction(() => {
    for (const status of json) {
      if (checkData(status, {
        description: 'string',
        id: 'number',
        name: 'string',
        can_errored: 'boolean',
        can_finalized: 'boolean',
      })) {
        acceptor.set(status.id, {
          description: status.description,
          id: status.id,
          name: status.name,
          canErrored: status.can_errored,
          canFinalized: status.can_finalized,
        });
      }
    }
  });
});

export {
  getSessions, getPackets, getPacketTypes, getDevices, getSessionStatuses, postSession,
};
