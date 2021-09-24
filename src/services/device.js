/* eslint key-spacing: off, no-param-reassign: off */
import moment from 'moment';
import { transaction } from 'mobx';

import { get, patch, post } from 'utils/request';
import checkData from 'utils/dataCheck';
import Device from 'models/devices/device';
import apiCheckConsole from 'utils/console';
import { alineDates, daterangeToArgs, isDateRange } from 'utils/date';

import { getBeverages, getBeveragesStats } from './beverage';

const LOCATION = '/refs/devices/';

const LOCATION_EXTERNAL = '/refs/devices/stats-extend/';

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
  maintenance: 'maintenanceDate',
  tz: 'timeZone',
  lastoff: 'stopDate',
  tech: 'isNeedTechService',
  sync_date: 'priceSyncDate',
  status: 'status',
  description: 'description',
  software_version: 'softwareVersion',
  auth_key: 'authKey',
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
      sync_date: 'date',
      description: 'string',
      auth_key: 'string',
      software_version: 'string',
    },
  )) {
    apiCheckConsole.error(`Неожиданный ответ по адресу ${LOCATION}`, json);
  }
  for (const [jsonName, modelName] of Object.entries(RENAMER)) {
    if (modelName.indexOf('Date') >= 0) {
      acceptor[modelName] = json[jsonName] && moment(json[jsonName]);
    } else {
      acceptor[modelName] = json[jsonName];
    }
  }
  return acceptor;
}

const getDevices = (session) => () => new Promise((resolve, reject) => {
  const general = get(LOCATION).then((result) => {
    if (!Array.isArray(result)) {
      apiCheckConsole.error(`по ${LOCATION} ожидается массив, получен ${typeof result}`, result);
    }
    const responce = {
      count: result.length,
      results: result.map((deviceData) => converter(deviceData, new Device(session))),
    };
    resolve(responce);
    return responce.results;
  }).catch(reject);
  const external = get(LOCATION_EXTERNAL).then((result) => {
    const addition = new Map();
    if (Array.isArray(result)) {
      for (const json of result) {
        if (checkData(json, {
          id: 'number',
          downtime: 'number',
          has_off_devices: 'boolean',
          iterations_to: 'number',
          has_overloc_ppm: 'boolean',
          need_tech_service: 'boolean',
          opened_tasks: 'boolean',
        })) {
          addition.set(json.id, {
            downtime: json.downtime,
            isHasOverlocPPM: json.has_overloc_ppm,
            isNeedTechService: json.need_tech_service,
            isHaveOverdueTasks: json.opened_tasks,
            mileage: json.iterations_to,
          });
        }
      }
    } else {
      apiCheckConsole.error(`по ${LOCATION} ожидается массив, получен ${typeof result}`, result);
    }
    return addition;
  });
  Promise.all([general, external]).then(([devices, addition]) => {
    transaction(() => {
      for (const device of devices) {
        if (addition.has(device.id)) {
          for (const [key, value] of Object.entries(addition.get(device.id))) {
            device[key] = value;
          }
        } else {
          apiCheckConsole.error(`Пропущена добавка для устройства ${device.id}`, addition, devices);
        }
      }
    });
  });
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
          apiCheckConsole.error('Неожиданные данные для моделей устройств /refs/device_models', datum);
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
    iterations: 'number', // кол-во циклов на 1 ТО
    iterations_to: 'number', // общий пробег машины
    remain_iterations_to: 'number', // сколько осталось циклов до ТО
    need_tech_service: 'boolean',
    overdue_tasks: 'number',
    ppm: 'number',
    sum: 'number',
    sum_prev: 'number',
    sync_date: 'date',
  };

  if (!checkData(json, mustBe)) {
    apiCheckConsole.error(`${LOCATION}${id}/stats/ unexpected responce for ${id} device details`, json);
  }

  if (json.iterations !== json.iterations_to + json.remain_iterations_to) {
    apiCheckConsole.error(`device dtail consistency error: ${json.iterations_to} + ${json.remain_iterations_to} !== ${json.iterations}
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
    iterations_to:        'techServicesMileage',
    sum:               'salesLastDayAmount',
    sum_prev:          'salesPrewDayAmount',
  };
  const result = {};
  for (const [jsonName, dataName] of Object.entries(renamer)) {
    result[dataName] = json[jsonName];
  }
  result.waterQualityMetric = result.isHaveWaterQualityMetric ? result.waterQualityMetric : null;
  result.techServiceForecastDate = moment(result.techServiceForecastDate);
  result.techServicesPercentage = (result.techServicesWhole - result.techServicesRemain) / result.techServicesWhole * 100;
  return result;
});

const getSalesChart = (deviceId, daterange) => getBeveragesStats(daterange, `device__id=${deviceId}`, 86400);

const applyDevice = (id, changes, session) => {
  const data = {};
  const renamer = new Map(Object.entries(RENAMER).map(([a, b]) => [b, a]));
  for (const [key, value] of Object.entries(changes)) {
    data[renamer.get(key)] = value;
    if (moment.isMoment(value)) {
      data[renamer.get(key)] = value.format();
    }
  }
  const request = id === null ? post(LOCATION, data) : patch(`${LOCATION}${id}`, data);
  return request.then((response) => converter(response, id === null ? new Device(session) : {}));
};

const getDeviceTypes = (acceptor) => get('/refs/device_types').then((json) => {
  if (Array.isArray(json)) {
    for (const item of json) {
      if (checkData(item, { id: 'number', name: 'string' })) {
        acceptor.set(item.id, item.name);
      } else {
        apiCheckConsole.error('unexpected device_type recponce');
      }
    }
  } else {
    apiCheckConsole.error('unexpected device_type recponce');
  }
});

// Маршрут был перепутан с жесткостью воды. Переписать когда переписать когда придут реальный маршрут
const getVoltage = (deviceId, daterange) => {
  const dateRangeArg = daterangeToArgs(daterange, 'device_date');
  const step = dateRangeArg === '' ? 86400 : Math.max(60, ...[3600, 86400].filter((s) => (daterange[1] - daterange[0]) / s / 1000 > 10));
  return get(`/data/counters/pcb_voltage/?step=${step}&device=${deviceId}${dateRangeArg}`)
    .then((result) => {
      const mustBe = {
        device_date: 'date',
        device_id: 'number',
        pcb_v1: 'array',
        pcb_v2: 'array',
        pcb_v3: 'array',
      };
      for (const item of result) {
        checkData(item, mustBe);
      }
      const isRangeGiven = isDateRange(daterange);
      if (!isRangeGiven && result.length === 0) {
        return [];
      }

      return result.map((item) => ({
        moment: moment(item.device_date),
        pcbV1: item.pcb_v1,
        pcbV2: item.pcb_v2,
        pcbV3: item.pcb_v3,
      }));
    });
};

const getWaterQuality = (deviceId, daterange) => {
  const dateRangeArg = daterangeToArgs(daterange, 'device_date');
  const step = dateRangeArg === '' ? 86400 : Math.max(60, ...[3600, 86400].filter((s) => (daterange[1] - daterange[0]) / s / 1000 > 10));
  return get(`/data/counters/pcb_water_hardness/?step=${step}&device=${deviceId}${dateRangeArg}`)
    .then((result) => {
      const mustBe = {
        device_date: 'date',
        device_id: 'number',
        pcb_tds1: 'number',
      };
      for (const json of result) {
        checkData(json, mustBe);
      }
      const isRangeGiven = isDateRange(daterange);
      if (!isRangeGiven && result.length === 0) {
        return [];
      }
      const finalDateRange = isRangeGiven
        ? daterange
        : [moment(result[0].device_date), moment(result[result.length - 1].device_date)];
      return [...alineDates(
        finalDateRange,
        step,
        result,
        (item) => ({ quality: item ? item.pcb_tds1 : 0 }),
        'device_date',
      )];
    });
};

const QR_BEVERAGE_PAYMENT_TYPE = 4;

const getQR = (deviceId, daterange) => {
  const dangeart = daterangeToArgs(daterange, 'device_date');
  return getBeverages()(1, 0, `device__id=${deviceId}&operation__id=${QR_BEVERAGE_PAYMENT_TYPE}${dangeart}`).then(({ count }) => count);
};

const getLastCleanings = () => get('data/events/last_cleanings/').then((json) => {
  const result = new Map();
  if (typeof json !== 'object' || json === null) {
    apiCheckConsole.error('last_cleanings ожидается объект, получено ', json);
    return new Map();
  }
  for (const [id, date] of Object.entries(json)) {
    checkData({ date }, { date: 'date' });
    result.set(parseInt(id, 10), moment(date));
  }
  return result;
});

const getUncleaned = () => get('refs/devices/uncleaned/').then((json) => (
  Array.isArray(json)
    ? json.filter((note) => checkData(note, { id: 'number', beverages: 'number' }))
    : []
));

const getDisabled = () => get('refs/devices/unused/').then((json) => (
  Array.isArray(json)
    ? json.filter((note) => checkData(note, { id: 'number', unused: 'number' }))
      .map(({ id, unused }) => ({ id, unused: unused * 1000 }))
    : []
));

const getCleaningsCount = (dateRange) => {
  const dangeart = daterangeToArgs(dateRange, 'open_date');
  const url = `/data/events/points_cleanings/?${dangeart}`;

  return get(url).then((json) => json);
};

export {
  getDevices, getDeviceModels, getStats, getSalesChart,
  applyDevice, getDeviceTypes, getVoltage, getWaterQuality, getQR, getLastCleanings, getUncleaned, getDisabled,
  getCleaningsCount,
};
