/* eslint camelcase: off */
import { computed } from 'mobx';

class Event {
  id;

  cid;

  createDate;

  closeDate;

  openDate;

  deviceId;

  duration;

  eventId;

  get eventColor() {
    const { event } = this;
    if (event) {
      return event.color;
    }
    return undefined;
  }

  constructor(session) {
    this.session = session;
  }

  get device__sale_point__company__id() {
    return this.company.id;
  }

  get start_date() {
    return this.openDate.format();
  }

  @computed get salePointId() {
    const { salePoint } = this;
    if (!salePoint) {
      return undefined;
    }
    return salePoint.id;
  }

  @computed get event() {
    return this.session.eventTypes.get(this.eventId);
  }

  @computed get device() {
    return this.session.devices.get(this.deviceId);
  }

  @computed get salePoint() {
    const { device } = this;
    if (!device) {
      return device;
    }
    return device.salePoint;
  }

  @computed get company() {
    const { device } = this;
    if (!device) {
      return device;
    }
    return device.company;
  }

  @computed get companyId() {
    const { company } = this;
    if (!company) {
      return company;
    }
    return company.id;
  }

  @computed get salePointName() {
    const { salePoint } = this;
    return salePoint && salePoint.name;
  }

  @computed get deviceName() {
    const { device } = this;
    if (!device) {
      return device;
    }
    return device.name;
  }

  @computed get eventName() {
    const { event } = this;
    if (event) {
      return event.name;
    }
    return event;
  }

  @computed get eventDescription() {
    const { event } = this;
    if (event) {
      return event.description;
    }
    return event;
  }

  @computed get eventPriority() {
    const { event } = this;
    if (event) {
      return event.priority;
    }
    return event;
  }

  @computed get eventPriorityDescription() {
    const { event } = this;
    return event ? event.priorityDescription : event;
  }

  @computed get companyName() {
    const { company } = this;
    if (company) {
      return company.name;
    }
    return company;
  }
}

export default Event;
