import moment from 'moment';

import { get, patch } from 'utils/request';
import checkData from 'utils/dataCheck';

import EventType from 'models/events/eventType';
import Event from 'models/events/event';
import { daterangeToArgs, alineDates, isDateRange } from 'utils/date';

const TECH_CLEARANCE_EVENT_ID = 8;

const getEvents = (session) => (limit, offset = 0, filter = '') => {
  console.assert(limit > 0 && offset >= 0, `Неверные параметры запроса событий "${limit}" "${offset}"`);
  return get(`/data/events/?limit=${limit}&offset=${offset || 0}${filter !== '' ? `&${filter}` : filter}`).then((response) => {
    const mustBe = {
      id: 'number',
      cid: 'string',
      open_date: 'date',
      created_date: 'date',
      device: 'number',
      duration: 'number',
      event_reference: 'number',
      overdued: 'boolean',
    };
    const mayBe = {
      close_date: 'date',
      overdued_duration: 'number',
    };
    checkData(response, {
      count: 'number',
      results: 'array',
    }, {
      next: 'string',
      previous: 'string',
    }, {
      results: (events) => {
        for (const event of events) {
          if (!checkData(event, mustBe, mayBe)) {
            console.error('провален тест для события', event);
            return false;
          }
        }
        return true;
      },
    });
    const renames = {
      id: 'id',
      cid: 'cid',
      close_date: 'closeDate',
      open_date: 'openDate',
      created_date: 'createdDate',
      device: 'deviceId',
      duration: 'duration',
      event_reference: 'eventId',
      overdued: 'isOverdued',
    };
    return {
      count: response.count,
      results: response.results.map((data) => {
        const result = new Event(session);
        for (const [key, value] of Object.entries(data)) {
          if (key.indexOf('date') >= 0) {
            result[renames[key]] = moment(value);
          } else {
            result[renames[key]] = value;
          }
        }
        return result;
      }),
    };
  });
};

const getClearances = (session) => (limit, offset = 0, filter = '') => (
  getEvents(session)(limit, offset, `event_reference__id=${TECH_CLEARANCE_EVENT_ID}${filter !== '' ? `&${filter}` : filter}`)
);

const getOverdued = (session) => (limit, offset = 0, filter = '') => (
  getEvents(session)(limit, offset, `overdued=1${filter !== '' ? `&${filter}` : filter}`)
);

const TYPES_RENAMER = {
  id: 'id',
  cid: 'cid',
  name: 'name',
  reaction_time: 'reactionTime',
  priority: 'priorityId',
  color: 'color',
  description: 'description',
  hidden: 'isHidden',
};

const TYPES_LOCATION = '/refs/event_references/';

const transform = (json, acceptor) => {
  const eventType = {
    ...json,
    color: json.color || '#FFFFFF',
  };
  if (!checkData(
    eventType,
    {
      id: 'number',
      cid: 'string',
      name: 'string',
      reaction_time: 'number',
      hidden: 'boolean',
      color: 'color',
    }, {
      priority: 'number',
      description: 'string',
    },
  )) {
    console.error(`Неожиданный ответ по адресу ${TYPES_LOCATION}`, eventType);
  }
  for (const [jsonName, dataName] of Object.entries(TYPES_RENAMER)) {
    // eslint-disable-next-line
    acceptor[dataName] = eventType[jsonName];
  }
  return acceptor;
};

const form = (data) => {
  const json = {};
  const renamer = new Map(Object.entries(TYPES_RENAMER).map(([dataName, jsonName]) => [jsonName, dataName]));
  for (const [key, value] of Object.entries(data)) {
    json[renamer.get(key)] = value;
  }
  return json;
};

const getEventTypes = (session) => () => get(TYPES_LOCATION).then((results) => {
  if (!Array.isArray(results)) {
    console.error(`по ${TYPES_LOCATION} ожидается массив, получен ${typeof results}`, results);
  }
  return {
    count: results.length,
    results: results.map((json) => transform(json, new EventType(session))),
  };
});

const patchEventType = (id, data) => patch(`${TYPES_LOCATION}${id}`, form(data)).then((josn) => transform(josn, {}));

const getEventsClearancesChart = (deviceId, daterange) => get(
  `/data/events/cleanings/?device__id=${deviceId}${daterangeToArgs(daterange, 'open_date')}`,
).then((result) => {
  if (!Array.isArray(result)) {
    console.error('can not ger data from /data/events/cleanings/', result);
    return [];
  }
  const mustBe = {
    day: 'date',
    actual: 'number',
    expected: 'number',
    beverages: 'number',
  };
  if (!Array.isArray(result)) {
    console.error('can not ger data from /data/events/cleanings/', result);
    return [];
  }
  for (const d of result) {
    if (!checkData(d, mustBe)) {
      console.error('Неожиданные данные для эндпоинта /data/events/cleanings/', d);
    }
  }
  const isRangeGiven = isDateRange(daterange);
  if (!isRangeGiven && result.length === 0) {
    return [];
  }
  const finalDateRange = isRangeGiven
    ? daterange
    : [moment(result[0].day), moment(result[result.length - 1].day)];
  return [...alineDates(
    finalDateRange,
    86400,
    result.map(({ day, ...other }) => ({ moment: day, ...other })),
    (item) => (
      item ? {
        fact: item.actual,
        expect: item.expected,
        beverages: item.beverages,
      } : {
        fact: 0,
        expect: 0,
        beverages: 0,
      }
    ),
  )];
});

const getDetergrnts = (filter) => get(`/data/events/detergent/?${filter}`).then((json) => {
  const errorResponse = {
    decalcents: 0,
    detergent: 0,
    tablets: 0,
  };
  if (typeof json !== 'object') {
    console.error(`/data/events/detergent/?${filter} result not an object`);
    return errorResponse;
  }
  if (!checkData(json, {
    decalcents: 'number',
    detergent: 'number',
    tablets: 'number',
  })) {
    return errorResponse;
  }
  return json;
});

const getDowntimes = (filter) => get(`/data/events/downtime-salepoints/?${filter}`).then((json) => {
  if (!Array.isArray(json)) {
    console.error(`/data/events/downtime-salepoints/?${filter} isn't array`);
  }
  for (const datum of json) {
    checkData(datum, {
      salePointId: 'number',
      downtime: 'number',
    });
  }
  return json;
});

const getEventPriorities = (acceptor) => get('refs/event_priorities/').then(((data) => {
  if (!Array.isArray(data)) {
    console.error('ожидается массив от эндпоинта /refs/event_priorities/');
    return;
  }
  for (const json of data) {
    if (checkData(json, {
      critical_time: 'number',
      description: 'string',
      id: 'number',
      value: 'string',
    })) {
      acceptor.set(json.id, {
        criticalTime: json.critical_time,
        description: json.description,
        value: json.value,
      });
    }
  }
}));

export {
  getEvents, getEventTypes, getEventsClearancesChart, getClearances, getDetergrnts, getOverdued, getDowntimes, getEventPriorities, patchEventType,
};
