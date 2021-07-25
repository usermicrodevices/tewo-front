import moment from 'moment';

import {
  sequentialGet, get, patch, post, blob,
} from 'utils/request';
import checkData from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';

import EventType from 'models/events/eventType';
import Event from 'models/events/event';
import { daterangeToArgs, alineDates, isDateRange } from 'utils/date';

const TECH_CLEARANCE_EVENT_ID = 8;

const getEvents = (session, getter = get) => (limit, offset = 0, filter = '') => {
  apiCheckConsole.assert(limit > 0 && offset >= 0, `Неверные параметры запроса событий "${limit}" "${offset}"`);
  return getter(`/data/events/?limit=${limit}&offset=${offset || 0}${filter !== '' ? `&${filter}` : filter}`).then((response) => {
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
            apiCheckConsole.error('провален тест для события', event);
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

const exportEvents = (filter = '') => blob(`/data/events/xlsx/${filter !== '' ? `?${filter}` : filter}`);

const getClearances = (session, getter = get) => (limit, offset = 0, filter = '') => (
  getEvents(session, getter)(
    limit,
    offset,
    `event_reference__id=${TECH_CLEARANCE_EVENT_ID}${filter !== '' ? `&${filter}` : filter}`,
  )
);

const getOverdued = (session, getter = get) => (limit, offset = 0, filter = '') => (
  getEvents(session, get)(limit, offset, `overdued=1${filter !== '' ? `&${filter}` : filter}`)
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
    apiCheckConsole.error(`Неожиданный ответ по адресу ${TYPES_LOCATION}`, eventType);
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
    if (renamer.has(key)) {
      json[renamer.get(key)] = value;
    }
  }
  if (data.reactionTimeMinutes) {
    json.reaction_time = data.reactionTimeMinutes * 60;
  }
  return json;
};

const getEventTypes = (session) => () => get(TYPES_LOCATION).then((results) => {
  if (!Array.isArray(results)) {
    apiCheckConsole.error(`по ${TYPES_LOCATION} ожидается массив, получен ${typeof results}`, results);
  }
  return {
    count: results.length,
    results: results.map((json) => transform(json, new EventType(session))),
  };
});

const patchEventType = (id, data) => patch(`${TYPES_LOCATION}${id}`, form(data)).then((josn) => transform(josn, {}));

const patchCustomEventType = (id, data) => post(`${TYPES_LOCATION}${id}/custom/`, form(data)).then((josn) => transform(josn, {}));

const getEventsClearancesChart = (deviceId, daterange, getter = get) => {
  const args = (() => {
    if (!Array.isArray(deviceId)) {
      return `?device__id=${deviceId}${daterangeToArgs(daterange, 'open_date')}`;
    }
    if (deviceId.length === 1) {
      return `?device__id=${deviceId[0]}${daterangeToArgs(daterange, 'open_date')}`;
    }
    if (deviceId.length > 1) {
      return `?device__id__in=${deviceId}${daterangeToArgs(daterange, 'open_date')}`;
    }
    const range = daterangeToArgs(daterange, 'open_date');
    if (range) {
      return `?${daterangeToArgs(daterange, 'open_date').slice(1)}`;
    }
    return '';
  })();
  return getter(
    `/data/events/cleanings/${args}`, getter,
  ).then((result) => {
    if (!Array.isArray(result)) {
      apiCheckConsole.error('can not ger data from /data/events/cleanings/', result);
      return [];
    }
    const mustBe = {
      day: 'date',
      actual: 'number',
      expected: 'number',
      beverages: 'number',
    };
    if (!Array.isArray(result)) {
      apiCheckConsole.error('can not ger data from /data/events/cleanings/', result);
      return [];
    }
    for (const d of result) {
      if (!checkData(d, mustBe)) {
        apiCheckConsole.error('Неожиданные данные для эндпоинта /data/events/cleanings/', d);
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
          beverages: typeof item.beverages === 'number' ? item.beverages : 0,
        } : {
          fact: 0,
          expect: 0,
          beverages: 0,
        }
      ),
    )];
  });
};

const getDetergents = (filter, getter = get) => {
  const location = `/data/events/detergent/${filter ? `?${filter}` : ''}`;
  return getter(location).then((json) => {
    const errorResponse = {
      decalcents: 0,
      detergent: 0,
      tablets: 0,
    };
    if (typeof json !== 'object') {
      apiCheckConsole.error(`${location} result not an object`);
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
};

const getDowntimes = (filter, getter = get) => getter(`/data/events/downtime-salepoints/?${filter}`).then((json) => {
  if (!Array.isArray(json)) {
    apiCheckConsole.error(`/data/events/downtime-salepoints/?${filter} isn't array`);
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
    apiCheckConsole.error('ожидается массив от эндпоинта /refs/event_priorities/');
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
  getEvents, getEventTypes, getEventsClearancesChart, getClearances, getDetergents, getOverdued, getDowntimes, getEventPriorities, patchEventType,
  exportEvents, patchCustomEventType,
};
