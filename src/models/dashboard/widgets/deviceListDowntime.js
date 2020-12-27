import { computed, observable, reaction } from 'mobx';
import moment from 'moment';

const intoResolver = (items) => {
  const result = {};
  if (Array.isArray(items)) {
    for (const itm of items) {
      result[itm.id] = itm;
    }
  }
  return result;
};

const unite = (a, b) => ({
  sum: a.sum + b.sum,
  details: (() => {
    const result = JSON.parse(JSON.stringify(b.details));
    for (const [eventTypeId, duration] of Object.entries(a.details)) {
      if (eventTypeId in result) {
        result[eventTypeId] += duration;
      } else {
        result[eventTypeId] = duration;
      }
    }
  })(),
});

class DeviceListOff {
  session;

  generic;

  @observable data;

  constructor(settings, session) {
    this.generic = settings;
    this.session = session;

    reaction(() => [this.generic.salePointsId, this.generic.dateRange], () => {
      this.data = undefined;
      this.update();
    });
    this.update();
  }

  @computed get isLoaded() {
    return this.session.devices.isLoaded && typeof this.data !== 'undefined';
  }

  @computed get joinedData() {
    const devicesResolver = intoResolver(this.session.devices.rawData);
    const result = {};
    for (const [deviceId, deviceInfo] of Object.entries(this.data)) {
      const { salePointId } = devicesResolver[deviceId];
      if (salePointId in result) {
        unite(result[salePointId], deviceInfo);
      } else {
        result[salePointId] = deviceInfo;
      }
    }
    return result;
  }

  @computed get rows() {
    const { joinedData } = this;
    const pointsSet = new Set(Object.keys(joinedData).map((v) => parseInt(v, 10)));
    const pointsResolver = intoResolver(this.session.points.getSubset(pointsSet));
    const eventsResolver = intoResolver(this.session.eventTypes.rawData);
    return Object.entries(joinedData).map(([pointId, { sum, details }]) => {
      const detailsList = [];
      for (const [eventTypeId, value] of Object.entries(details)) {
        detailsList.push({
          eventTypeName: eventsResolver[eventTypeId]?.name,
          eventTypeId,
          value,
        });
      }
      return {
        name: pointsResolver[pointId]?.name,
        value: {
          sum,
          details: detailsList,
        },
        id: pointId,
        key: pointId,
      };
    });
  }

  update = () => {
    this.session.events.getOverdueTasks(this.generic.dateRange, this.generic.getPointsFilter('device__sale_point__id')).then(({ results }) => {
      const devices = {};
      for (const {
        openDate, closeDate, eventId, deviceId,
      } of results) {
        if (!(deviceId in devices)) {
          devices[deviceId] = { details: {}, sum: 0 };
        }
        const events = devices[deviceId].details;
        if (!(eventId in events)) {
          events[eventId] = 0;
        }
        const lastDate = closeDate.isValid() ? closeDate : moment();
        const duration = lastDate - openDate;
        events[eventId] += duration;
        devices[deviceId].sum += duration;
      }
      this.data = devices;
    });
  };
}

export default DeviceListOff;
