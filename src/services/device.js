/* eslint key-spacing: off, no-param-reassign: off */
import moment from 'moment';

import { get, patch, post } from 'utils/request';
import checkData from 'utils/dataCheck';
import Device from 'models/devices/device';

import { getBeveragesStats } from './beverage';

const LOCATION = '/refs/devices/';

const RENAMER = {
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

function converter(json, acceptor) {
  if (!checkData(
    json,
    {
      id: 'number',
      controller: 'string',
      created_date: 'date',
      setup_date: 'date',
      name: 'string',
      sale_point: 'number',
      tz: 'string',
      status: 'number',
      has_overloc_ppm: 'boolean',
      need_tech_service: 'boolean',
      opened_tasks: 'boolean',
      tech: 'boolean',
      downtime: 'number',
      change_null_sum_bev_by_cost: 'boolean',
    }, {
      serial: 'string',
      device_model: 'number',
      price_group: 'number',
      maintenance: 'date',
      lastoff: 'date',
    },
  )) {
    console.error(`Неожиданный ответ по адресу ${LOCATION}`, json);
  }
  for (const [jsonName, modelName] of Object.entries(RENAMER)) {
    if (modelName.indexOf('Date') >= 0) {
      acceptor[modelName] = moment(json[jsonName]);
    } else {
      acceptor[modelName] = json[jsonName];
    }
  }
  acceptor.isOn = json.status === 1;
  acceptor.isInactive = json.status === -1;
  return acceptor;
}

const getDevices = (session) => () => get(LOCATION).then((result) => {
  if (!Array.isArray(result)) {
    console.error(`по ${LOCATION} ожидается массив, получен ${typeof result}`, result);
  }
  return {
    count: result.length,
    results: result.map((deviceData) => converter(deviceData, new Device(session))),
  };
});

function getDeviceModels(map) {
  return get('/refs/device_models').then((data) => {
    if (Array.isArray(data)) {
      for (const datum of data) {
        if (!checkData(datum, {
          id: 'number',
          name: 'string',
          mileage: 'number',
          detergent: 'number',
          decalcents: 'number',
          threshold_drinks_cleaning: 'number',
        }, { device_type: 'number' })) {
          console.error('Неожиданные данные для моделей устройств /refs/device_models', datum);
        }
        map.set(datum.id, {
          name: datum.name,
          mileage: datum.mileage,
          detergent: datum.detergent,
          deviceTypeId: datum.device_type,
        });
      }
    }
    return map;
  });
}

const getStats = (id) => get(`${LOCATION}${id}/stats/`).then((json) => {
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

const getSalesChart = (deviceId, daterange) => getBeveragesStats(daterange, `device__id=${deviceId}`, 86400);

const applyDevice = (id, changes) => {
  const data = {};
  const renamer = new Map(Object.entries(RENAMER).map(([a, b]) => [b, a]));
  for (const [key, value] of Object.entries(changes)) {
    data[renamer.get(key)] = value;
    if (moment.isMoment(value)) {
      data[renamer.get(key)] = value.format();
    }
  }
  const request = id === null ? post(LOCATION, data) : patch(`${LOCATION}${id}`, data);
  return request.then((response) => converter(response, {}));
};

const getDeviceTypes = (acceptor) => get('/refs/device_types').then((json) => {
  if (Array.isArray(json)) {
    for (const item of json) {
      if (checkData(item, { id: 'number', name: 'string' })) {
        acceptor.set(item.id, item.name);
      } else {
        console.error('unexpected device_type recponce');
      }
    }
  } else {
    console.error('unexpected device_type recponce');
  }
});

export {
  getDevices, getDeviceModels, getStats, getSalesChart, applyDevice, getDeviceTypes,
};
