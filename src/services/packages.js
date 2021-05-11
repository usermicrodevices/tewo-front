import { transaction, when } from 'mobx';
import {
  get, post,
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
    devices: 'array',
    id: 'number',
    packet: 'number',
    status: 'number',
  }, {
    description: 'string',
    updated_at: 'date',
  });
  return new DeviceSession({
    id: v.id,
    name: v.name,
    description: v.description,
    devices: v.devices.map((deviceJSON) => {
      checkData(deviceJSON, {
        created_at: 'date',
        device: 'number',
        id: 'number',
        status: 'number',
      });
      return {
        created: new Date(deviceJSON.created_at),
        deviceId: deviceJSON.device,
        statusId: deviceJSON.status,
        packageUploadId: deviceJSON.id,
      };
    }),
    packetId: v.packet,
    created: moment(v.created_at),
    updated: v.updated_at ? moment(v.updated_at) : null,
    statusId: v.status,
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

const getDevices = (session, manager) => () => Promise.all([
  when(() => session.devices.isLoaded),
  get('/local_api/device_packet_statuses/lasts_loading/').then((json) => {
    if (typeof json === 'object') {
      for (const [key, value] of Object.entries(json)) {
        if (key != parseInt(key, 10) || key < 0) {
          apiCheckConsole.warn('lasts_loading ожидаются юиды в качестве ключей объекта, получено', key);
        }
        if (typeof value !== 'number' || value < 0) {
          apiCheckConsole.warn('lasts_loading ожидаются юиды в качестве значений объекта, получено', value);
        }
      }
      return json;
    }
    apiCheckConsole.warn('lasts_loading ожидаются объект, получено', json);
    return {};
  }),
]).then(([_, lastLoading]) => ({
  count: session.devices.rawData.length,
  results: session.devices.rawData.map((device) => new Device(
    device,
    lastLoading[device.id] || null,
    session,
    manager,
  )),
}));

const postSession = (data, session, manager) => post('/local_api/sessions/', {
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

const getDeviceStatuses = (acceptor) => get('/local_api/device_statuses/').then((json) => {
  if (!Array.isArray(json)) {
    apiCheckConsole.warn('device_statuses must be an array');
    return;
  }
  for (const status of json) {
    checkData(status, {
      can_canceled: 'boolean',
      can_errored: 'boolean',
      can_finalized: 'boolean',
      description: 'string',
      id: 'number',
      name: 'string',
      weight: 'number',
    }, {
      icon: 'string',
    });
    acceptor.set(status.id, {
      isCanCanceled: status.can_canceled,
      isCanErrored: status.can_errored,
      isCanFinalized: status.can_finalized,
      description: status.description,
      id: status.id,
      name: status.name,
      weight: status.weight,
      icon: status.icon,
    });
  }
});

export {
  getSessions, getPackets, getPacketTypes, getDevices, getSessionStatuses, postSession, getDeviceStatuses,
};
