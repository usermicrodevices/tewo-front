/* eslint class-methods-use-this: off */
import { computed, observable, reaction } from 'mobx';
import moment from 'moment';

import BerevagesStatsPair from 'models/beverages/statsPair';
import DetailsProps from 'models/detailsProps';

const STORAGE_KEY = 'devices_inputs_storage';

class Details {
  @observable waterQuality;

  @observable stats = null;

  @observable clearancesAmount;

  @observable lastBeverages;

  @observable serviceEvents;

  @observable beveragesStats;

  @observable allClearancesDates;

  @observable clearancesChart;

  @observable voltage;

  @computed get voltageSeries() {
    const { minPower, maxPower } = { minPower: 220, maxPower: 240 };
    return [
      {
        data: this.voltage.map(({ voltage }) => voltage),
        name: 'Напряжение',
        axis: 0,
      },
      {
        name: `Мин. (${minPower})`,
        type: 'line',
        data: new Array(this.voltage.length).fill(minPower),
        axis: 0,
      },
      {
        name: `Макс. (${maxPower})`,
        type: 'line',
        data: new Array(this.voltage.length).fill(maxPower),
        axis: 0,
      },
    ];
  }

  @computed get voltageXSeria() {
    return this.voltage.map(({ moment: m }) => m);
  }

  imputsManager = new DetailsProps(STORAGE_KEY);

  @computed get xaxis() {
    const [begin, end] = [moment(), moment().add(this.waterQuality.length, 'day')];
    const result = [];

    const cur = moment(begin);
    while (cur < end) {
      result.push(cur.format('D MMMM'));
      cur.add(1, 'day');
    }
    return result;
  }

  constructor(me) {
    this.me = me;

    const updateDateRelatedData = () => {
      this.waterQuality = undefined;
      this.beveragesStats = new BerevagesStatsPair((daterange) => me.session.devices.getSalesChart(me.id, daterange), this.imputsManager);

      this.clearancesChart = undefined;

      me.session.events.getDeviceClearancesChart(me.id, this.imputsManager.dateRange).then((result) => {
        const series = {
          x: [],
          expected: [],
          beverages: [],
          actual: [],
          expectedSum: 0,
          actualSum: 0,
        };
        for (const {
          expect, beverages, fact, moment: rangeMoment,
        } of result) {
          series.x.push(rangeMoment);
          series.expected.push(expect);
          series.beverages.push(beverages);
          series.actual.push(fact);
          series.expectedSum += expect;
          series.actualSum += fact;
        }
        this.clearancesChart = series;
      });

      me.session.devices.getVoltage(this.me.id, this.imputsManager.dateRange).then((result) => {
        this.voltage = result;
      });
    };
    reaction(() => this.imputsManager.dateRange, updateDateRelatedData);
    updateDateRelatedData();
    me.session.devices.getStats(me.id).then((stats) => { this.stats = stats; });
    me.session.beverages.getBeveragesForDevice(me.id, 10).then(({ results }) => {
      this.lastBeverages = results;
    });
    me.session.events.getDeviceServiceEvents(me.id).then(({ results }) => {
      this.serviceEvents = results;
    });
    me.session.events.getDeviceClearancesEventsLastWeekCount(me.id).then((count) => {
      this.clearancesAmount = count;
    });

    me.session.events.getDeviceClearances(me.id).then(({ results }) => {
      const datesMap = {};
      results.forEach(({ openDate }) => {
        const key = openDate.format('YYYYMMDD');
        datesMap[key] = (datesMap[key] || 0) + 1;
      });
      this.allClearancesDates = datesMap;
    });
  }

  @computed get lastService() {
    if (!Array.isArray(this.serviceEvents)) {
      return undefined;
    }
    if (this.serviceEvents.length === 0) {
      return null;
    }
    return this.serviceEvents[this.serviceEvents.length - 1].openDate;
  }

  @computed get isWaterQualified() {
    return Array.isArray(this.waterQuality);
  }
}

export default Details;
