/* eslint camelcase: "off" */
import { computed } from 'mobx';

import plural from 'utils/plural';

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

  get durationText() {
    const beginYear = this.openDate.year();
    if (!this.closeDate.isValid()) {
      return `Начало ${this.openDate.format('DD MMMM YYYY HH:mm')} не завершено`;
    }
    const endYear = this.closeDate.year();
    if (beginYear !== endYear) {
      return `${this.openDate.format('DD MMMM YYYY HH:mm')} - ${this.closeDate.format('DD MMMM YYYY HH:mm')}`;
    }
    const beginMonth = this.openDate.month();
    const endMonth = this.closeDate.month();
    if (beginMonth !== endMonth) {
      return `${this.openDate.year()} год, ${this.openDate.format('DD MMMM HH:mm')} - ${this.closeDate.format('DD MMMM HH:mm')}`;
    }
    const beginDay = this.openDate.day();
    const endDay = this.closeDate.day();
    if (beginDay !== endDay) {
      return `${this.openDate.format('MMMM')} ${this.openDate.format('DD HH:mm')} - ${this.closeDate.format('DD HH:mm')}`;
    }
    const beginHour = this.openDate.hour();
    const endHour = this.closeDate.hour();
    if (beginHour !== endHour) {
      return `${this.openDate.format('DD MMMM')}, ${this.openDate.format('HH:mm')} - ${this.closeDate.format('HH:mm')}`;
    }
    const d = this.closeDate - this.openDate;
    const m = Math.floor(d / 60000);
    const s = Math.round((d - m * 60000) / 1000);
    if (m > 60) {
      console.warn(d, this.openDate, this.closeDate);
    }
    if (m === 0) {
      return `Произошло ${this.openDate.format('DD MMMM HH:mm')}, длилось ${s} ${plural(s, ['секунду', 'секунд', 'секунды'])}`;
    }
    if (m > 3) {
      return `Произошло ${this.openDate.format('DD MMMM HH:mm')}, длилось ${m} ${plural(s, ['минуту', 'минут', 'минуты'])}`;
    }
    return `Произошло ${this.openDate.format('DD MMMM HH:mm')}, длилось ${m}:${s >= 10 ? s : `0${s}`}`;
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
      return undefined;
    }
    return device.salePoint;
  }

  @computed get company() {
    const { device } = this;
    if (!device) {
      return undefined;
    }
    return device.company;
  }

  @computed get companyId() {
    const { company } = this;
    if (!company) {
      return undefined;
    }
    return company.id;
  }

  @computed get deviceName() {
    const { device } = this;
    if (!device) {
      return undefined;
    }
    return device.name;
  }

  @computed get eventName() {
    const { event } = this;
    if (event) {
      return event.name;
    }
    return undefined;
  }

  @computed get eventPriority() {
    const { event } = this;
    if (event) {
      return event.priority;
    }
    return undefined;
  }

  @computed get companyName() {
    const { company } = this;
    if (company) {
      return company.name;
    }
    return undefined;
  }
}

export default Event;
