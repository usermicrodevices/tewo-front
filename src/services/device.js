import moment from 'moment';

import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import Device from 'models/devices/device';

const getDevices = (session) => () => get('/refs/devices/').then((result) => {
  if (!Array.isArray(result)) {
    console.error(`по /refs/devices/ ожидается массив, получен ${typeof result}`, result);
  }
  return {
    count: result.length,
    results: result.map((deviceData) => {
      if (!checkData(
        deviceData,
        {
          id: 'number',
          controller: 'string',
          created_date: 'date',
          setup_date: 'date',
          name: 'string',
          sale_point: 'number',
          tz: 'string',
          status: 'number',
        }, {
          serial: 'string',
          device_model: 'number',
          price_group: 'number',
          maintenance: 'date',
        },
      )) {
        console.error('Неожиданный ответ по адресу /refs/devices/', deviceData);
      }
      const device = new Device(session);
      const renamer = {
        id: 'id',
        controller: 'controller',
        created_date: 'createdDate',
        setup_date: 'setupDate',
        name: 'name',
        sale_point: 'salePointId',
        serial: 'serial',
        device_model: 'deviceModelId',
        price_group: 'priceGroupId',
        tz: 'timeZone',
      };

      for (const [jsonName, modelName] of Object.entries(renamer)) {
        if (modelName.indexOf('Date') >= 0) {
          device[modelName] = moment(deviceData[jsonName]);
        } else {
          device[modelName] = deviceData[jsonName];
        }
      }
      device.isOn = deviceData.status === 1;
      device.isInactive = deviceData.status === -1;
      return device;
    }),
  };
});

function getDeviceModels(map) {
  return get('/refs/device_models').then((data) => {
    if (Array.isArray(data)) {
      for (const datum of data) {
        if (!checkData(datum, {
          id: 'number', name: 'string', mileage: 'number', detergent: 'number',
        })) {
          console.error('Неожиданные данные для моделей устройств /refs/device_models', datum);
        }
        map.set(datum.id, { name: datum.name, mileage: datum.mileage, detergent: datum.detergent });
      }
    }
    return map;
  });
}

export { getDevices, getDeviceModels };
