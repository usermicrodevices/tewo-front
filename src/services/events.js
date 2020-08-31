import moment from 'moment';

import { get } from 'utils/request';
import checkData from 'utils/dataCheck';

import EventType from 'models/events/eventType';
import Event from 'models/events/event';

const getEvents = (session) => (limit, offset = 0, filter = '') => {
  console.assert(limit >= 0 && offset >= 0, `Неверные параметры запроса событий "${limit}" "${offset}"`);
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
      };
      const result = new EventType();
      for (const [jsonName, dataName] of Object.entries(rename)) {
        result[dataName] = eventType[jsonName];
      }
      return result;
    }),
  };
});

export { getEvents, getEventTypes };
