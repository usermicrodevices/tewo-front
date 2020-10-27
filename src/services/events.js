import moment from 'moment';

import { get } from 'utils/request';
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

const getEventTypes = () => get('/refs/event_references/').then((results) => {
  if (!Array.isArray(results)) {
    console.error(`по /refs/event_references/ ожидается массив, получен ${typeof results}`, results);
  }
  return {
    count: results.length,
    results: results.map((rawEventType) => {
      const eventType = {
        ...rawEventType,
        color: rawEventType.color || '#FFFFFF',
      };
      if (!checkData(
        eventType,
        {
          id: 'number',
          cid: 'string',
          name: 'string',
          reaction_time: 'number',
          hidden: 'boolean',
        }, {
          priority: 'number',
          color: 'color',
          description: 'string',
        },
      )) {
        console.error('Неожиданный ответ по адресу /refs/event_references/', eventType);
      }
      const rename = {
        id: 'id',
        cid: 'cid',
        name: 'name',
        reaction_time: 'reactionTime',
        priority: 'priority',
        color: 'color',
        description: 'description',
        hidden: 'isHidden',
      };
      const result = new EventType();
      for (const [jsonName, dataName] of Object.entries(rename)) {
        result[dataName] = eventType[jsonName];
      }
      return result;
    }),
  };
});

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
  checkData(json, {
    decalcents: 'number',
    detergent: 'number',
    tablets: 'number',
  });
  return json;
});

export {
  getEvents, getEventTypes, getEventsClearancesChart, getClearances, getDetergrnts,
};
