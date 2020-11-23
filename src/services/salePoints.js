/* eslint no-param-reassign: off */
import { transaction } from 'mobx';
import moment from 'moment';

import {
  get, post, patch, del,
} from 'utils/request';
import SalePoint from 'models/salePoints/salePoint';
import checkData from 'utils/dataCheck';
import { daterangeToArgs, SemanticRanges, SmallSemanticRanges } from 'utils/date';
import { getEvents } from './events';
import { getBeveragesStats } from './beverage';

const RENAMER = {
  id: 'id',
  name: 'name',
  company: 'companyId',
  address: 'address',
  created_date: 'createdDate',
  map_point: 'mapPoint',
  city: 'cityId',
  person: 'person',
  phone: 'phone',
  emails: 'email',
  opened_tasks: 'isHaveOpenedTasks',
};

const LOCATION = '/refs/sale_points/';
const LOCATION_EXT = '/refs/sale_points/stats-extend/';

const SHUILD_BE = {
  id: 'number',
  name: 'string',
  company: 'number',
  created_date: 'date',
  opened_tasks: 'boolean',
};

const MAY_BE = {
  emails: 'string',
  person: 'string',
  phone: 'string',
  address: 'string',
  city: 'number',
  map_point: 'location',
  has_overloc_ppm: 'boolean',
  has_off_devices: 'boolean',
  need_tech_service: 'boolean',
  downtime: 'number',
};

const converter = (data, result) => {
  if (!checkData(data, SHUILD_BE, MAY_BE)) {
    console.error(`обнаружены ошибки при обработке эндпоинта ${LOCATION}`);
  }

  for (const [jsonName, objectName] of Object.entries(RENAMER)) {
    result[objectName] = jsonName === 'created_date' ? moment(data[jsonName]) : data[jsonName];
  }
  return result;
};

const getSalePoints = (session) => () => new Promise((resolve, reject) => {
  const getBasic = get(LOCATION).then((salePoints) => {
    if (!Array.isArray(salePoints)) {
      console.error(`${LOCATION} ожидаеся в ответ массив, получен ${typeof salePoints}`, salePoints);
      reject(salePoints);
      return { count: 0, responce: [] };
    }

    const responce = {
      count: salePoints.length,
      results: salePoints.map((data) => converter(data, new SalePoint(session))),
    };
    resolve(responce);
    return responce.results;
  }).catch(reject);
  const getExtend = get(LOCATION_EXT).then((data) => {
    const result = new Map();
    if (Array.isArray(data)) {
      for (const json of data) {
        if (checkData(json, {
          downtime: 'number',
          has_off_devices: 'boolean',
          has_overloc_ppm: 'boolean',
          id: 'number',
          need_tech_service: 'boolean',
        })) {
          result.set(json.id, {
            downtime: json.downtime,
            isHaveDisabledEquipment: json.has_off_devices,
            isHasOverlocPPM: json.has_overloc_ppm,
            isNeedTechService: json.need_tech_service,
          });
        }
      }
    } else {
      console.error(`${LOCATION_EXT} ожидаеся в ответ массив, получен ${typeof data}`, data);
    }
    return result;
  });
  Promise.all([getBasic, getExtend]).then(([points, addon]) => {
    transaction(() => {
      for (const point of points) {
        for (const [key, value] of Object.entries(addon.get(point.id))) {
          point[key] = value;
        }
      }
    });
  });
});

const applySalePoint = (item, changes, session) => {
  const data = {};
  const renamer = new Map(Object.entries(RENAMER).map(([a, b]) => [b, a]));
  for (const [key, value] of Object.entries(changes)) {
    data[renamer.get(key)] = value;
  }
  const request = item === null ? post(LOCATION, data) : patch(`${LOCATION}${item}`, data);
  return request.then((response) => converter(response, item === null ? new SalePoint(session) : {}));
};

const getSalesTop = (filter) => {
  const location = `/data/beverages/stats_drinks/?${filter}`;
  const mustBe = {
    drink_id: 'number',
    total: 'number',
    sum: 'number',
  };
  return get(location)
    .then((result) => {
      if (!Array.isArray(result)) {
        console.error(`can not ger data from ${location}`, result);
        return [];
      }
      return result.map((d) => {
        if (!checkData(d, mustBe)) {
          console.error(`unexpected data from ${location}`, d);
        }
        return {
          drinkId: d.drink_id,
          beverages: d.total,
          sales: d.sum / 100,
        };
      });
    });
};

const getSalesChart = (pointId, daterange) => {
  let filter = '';
  if (typeof pointId === 'number') {
    filter = `device__sale_point__id=${pointId}`;
  }
  if (Array.isArray(pointId) && pointId.length === 1) {
    filter = `device__sale_point__id=${pointId[0]}`;
  }
  if (Array.isArray(pointId) && pointId.length > 1) {
    filter = `device__sale_point__id__in=${pointId.join(',')}`;
  }
  return getBeveragesStats(daterange, filter, 86400);
};

const getOutdatedTasks = (pointId) => {
  const lastDay = [moment().subtract(1, 'day'), moment()];
  return getEvents(null)(1, 0, `device__sale_point__id__exact=${pointId}&overdued=1${daterangeToArgs(lastDay, 'open_date')}`).then(({ count }) => count);
};

const getSalePointLastDaysBeverages = (pointId) => (
  getBeveragesStats(SemanticRanges.prw7Days.resolver(), `device__sale_point__id=${pointId}`, 3600));

const getBeveragesSpeed = (pointsId) => (
  getBeveragesStats(SmallSemanticRanges.prwHour.resolver(), pointsId.length > 0 && `device__sale_point__id__in=${pointsId.join(',')}`, 60).then(({ data }) => {
    let sum = 0;
    for (const { beverages } of data) {
      sum += beverages;
    }
    return sum;
  })
);

const deleteSalePoint = (id) => del(`${LOCATION}${id}`);

export {
  applySalePoint,
  getSalePoints,
  getSalesTop,
  getSalesChart,
  getOutdatedTasks,
  getSalePointLastDaysBeverages,
  getBeveragesSpeed,
  deleteSalePoint,
};
