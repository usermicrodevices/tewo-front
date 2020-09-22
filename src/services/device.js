/* eslint key-spacing: off */
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
          opened_tasks: 'boolean',
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
        opened_tasks: 'isHaveOpenedTasks',
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

const getStats = (id) => get(`refs/devices/${id}/stats/`).then((json) => {
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

  if (!checkData(json, mustBe)) {
    console.error(`undexpected responce for ${id} device details`);
  }

  if (json.iterations !== json.iterations_to + json.remain_iterations_to) {
    console.error(`device dtail consistency error: ${json.iterations_to} + ${json.remain_iterations_to} !== ${json.iterations}
      (${json.iterations_to + json.remain_iterations_to} found)`);
  }

  const renamer = {
    beverages:         'beveragesLastDayAmount',
    beverages_prev:    'beveragesPrewDayAmount',
    downtime:          'downtime',
    forecast_date:     'techServiceForecastDate',
    has_overloc_ppm:   'isHaveWaterQualityMetric',
    need_tech_service: 'isNeedTechService',
    overdue_tasks:     'overdueTasksAmount',
    ppm:               'waterQualityMetric',
    remain_iterations_to: 'techServicesRemain',
    iterations:           'techServicesWhole',
    iterations_to:        'techServicesDid',
    sum:               'salesLastDayAmount',
    sum_prev:          'salesPrewDayAmount',
  };
  const result = {};
  for (const [jsonName, dataName] of Object.entries(renamer)) {
    result[dataName] = json[jsonName];
  }
  result.waterQualityMetric = result.isHaveWaterQualityMetric ? result.waterQualityMetric : null;
  result.techServiceForecastDate = moment(result.techServiceForecastDate);
  result.techServicesPercentage = result.techServicesDid / result.techServicesWhole * 100;
  return result;
});

export { getDevices, getDeviceModels, getStats };
