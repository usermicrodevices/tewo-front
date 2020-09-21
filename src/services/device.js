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
          downtime: 'number',
          has_overloc_ppm: 'boolean',
          need_tech_service: 'boolean',
          overdue_tasks: 'boolean',
          tech: 'boolean',
        }, {
          serial: 'string',
          device_model: 'number',
          price_group: 'number',
          maintenance: 'date',
          lastoff: 'date',
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
        downtime: 'downtime',
        has_overloc_ppm: 'hasOverlocPPM',
        need_tech_service: 'needTechService',
        overdue_tasks: 'isHaveOverdueTasks',
        lastoff: 'stopDate',
        tech: 'isNeedTechService',
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

const getStats = (id) => get(`refs/devices/${id}/stats/`).then((data) => {
  const mustBe = {
    beverages: 'number',
    beverages_prev: 'number',
    downtime: 'number',
    forecast_date: 'date',
    has_overloc_ppm: 'boolean',
    iterations: 'number',
    iterations_to: 'number',
    need_tech_service: 'boolean',
    overdue_tasks: 'number',
    ppm: 'number',
    remain_iterations_to: 'number',
    sum: 'number',
    sum_prev: 'number',
  };

  if (!checkData(data, mustBe)) {
    console.error(`undexpected responce for ${id} device details`);
  }

  if (data.iterations !== data.iterations_to + data.remain_iterations_to) {
    console.error(`device dtail consistency error: ${data.iterations_to} + ${data.remain_iterations_to} !== ${data.iterations}
      (${data.iterations_to + data.remain_iterations_to} found)`);
  }

  const renamer = {
    beverages:         'beveragesLastDayAmount',
    beverages_prev:    'beveragesPrewDayAmount',
    downtime:          'downtime',
    forecast_date:     'date',
    has_overloc_ppm:   'isHaveWaterQualityMetric',
    iterations:        'techServicesWhole',
    iterations_to:     'techServicesDid',
    need_tech_service: 'isNeedTechService',
    overdue_tasks:     'overdueTasksAmount',
    ppm:               'waterQualityMetric',
    remain_iterations_to: 'techServicesRemain',
    sum:               'salesLastDayAmount',
    sum_prev:          'salesPrewDayAmount',
  };
});

export { getDevices, getDeviceModels, getStats };
