/* eslint no-param-reassign: "off" */
import { get, post, patch } from 'utils/request';
import moment from 'moment';
import SalePoint from 'models/salePoints/salePoint';
import checkData from 'utils/dataCheck';
import { daterangeToArgs } from 'utils/date';
import { getEvents } from './events';

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
  has_overloc_ppm: 'isOutOfWaterQuality',
  has_off_devices: 'isHaveDisabledEquipment',
  need_tech_service: 'isNeedOverhaul',
  overdue_tasks: 'isHaveOutdatedEvents',
};

const LOCATION = '/refs/sale_points/';

const SHUILD_BE = {
  id: 'number',
  name: 'string',
  company: 'number',
  created_date: 'date',
  has_overloc_ppm: 'boolean',
  has_off_devices: 'boolean',
  need_tech_service: 'boolean',
  overdue_tasks: 'boolean',
};

const MAY_BE = {
  emails: 'string',
  person: 'string',
  phone: 'string',
  address: 'string',
  city: 'number',
  map_point: 'location',
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
  get(LOCATION).then((salePoints) => {
    if (!Array.isArray(salePoints)) {
      console.error(`/refs/sale_points ожидаеся в ответ массив, получен ${typeof salePoints}`, salePoints);
      reject(salePoints);
      return;
    }

    resolve({
      count: salePoints.length,
      results: salePoints.map((data) => converter(data, new SalePoint(session))),
    });
  }).catch(reject);
});

const applySalePoint = (item, changes) => {
  const data = {};
  const renamer = new Map(Object.entries(RENAMER).map(([a, b]) => [b, a]));
  for (const [key, value] of Object.entries(changes)) {
    data[renamer.get(key)] = value;
  }
  const request = item === null ? post(LOCATION, data) : patch(`${LOCATION}${item}`, data);
  request.then((response) => converter(response, {}));
};

const getSalesTop = (pointId, daterange) => {
  const rangeArg = daterangeToArgs(daterange, 'device_date');
  const location = `/data/beverages/stats_drinks/?device__sale_point__id=${pointId}${rangeArg}`;
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
  const rangeArg = daterangeToArgs(daterange, 'device_date');
  const location = `/data/beverages/stats/?device__sale_point__id=${pointId}${rangeArg}`;
  const mustBe = {
    day: 'date',
    total: 'number',
    sum: 'number',
  };
  return get(location).then((result) => {
    if (!Array.isArray(result)) {
      console.error(`can not ger data from ${location}`, result);
      return [];
    }
    return result.map((d) => {
      if (!checkData(d, mustBe)) {
        console.error(`Неожиданные данные для эндпоинта ${location}`, d);
      }
      return {
        day: moment(d.day),
        beverages: d.total,
        sales: d.sum / 100,
      };
    });
  });
};

const getOutdatedTasks = (pointId) => {
  const lastDay = [moment().subtract(1, 'day'), moment()];
  return getEvents(null)(1, 0, `device__sale_point__id__exact=${pointId}&overdued=1${daterangeToArgs(lastDay, 'open_date')}`).then(({ count }) => count);
};

export {
  applySalePoint, getSalePoints, getSalesTop, getSalesChart, getOutdatedTasks,
};
