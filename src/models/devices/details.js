/* eslint class-methods-use-this: off */
import { computed, observable, reaction } from 'mobx';
import moment from 'moment';

import BerevagesStatsPair from 'models/beverages/statsPair';
import DetailsProps from 'models/detailsProps';

const STORAGE_KEY = 'devices_inputs_storage';

function createMapRangeBar(rangeKey, dateKey) {
  return function mapRangeBar(item) {
    return {
      x: item[dateKey].format(),
      y: item[rangeKey],
    };
  };
}

class Details {
  @observable waterQuality;

  @observable stats = null;

  @observable lastBeverages;

  @observable serviceEvents;

  @observable beveragesStats;

  @observable allClearancesDates;

  @observable clearancesChart;

  @observable voltage;

  @observable usedQRCodes;

  @observable clearancesAmount;

  @observable lastClearances = [];

  @computed get voltageSeries() {
    return [
      {
        data: this.voltage.map(createMapRangeBar('pcbV1', 'moment')),
        name: 'L1',
      },
      {
        data: this.voltage.map(createMapRangeBar('pcbV2', 'moment')),
        name: 'L2',
      },
      {
        data: this.voltage.map(createMapRangeBar('pcbV3', 'moment')),
        name: 'L3',
      },
    ];
  }

  @computed get waterSeries() {
    if (!Array.isArray(this.waterQuality)) {
      return this.waterQuality;
    }
    return this.waterQuality.map(createMapRangeBar('quality', 'moment'));
  }

  @computed get waterQualityXSeria() {
    return this.waterQuality.map(({ moment: m }) => m);
  }

  imputsManager;

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
    this.imputsManager = new DetailsProps(`${STORAGE_KEY}-${me.id}`);

    const updateDateRelatedData = () => {
      this.waterQuality = undefined;
      this.beveragesStats = new BerevagesStatsPair((daterange) => me.session.devices.getSalesChart(me.id, daterange), this.imputsManager);

      this.clearancesChart = undefined;
      this.usedQRCodes = undefined;

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

      me.session.devices.getWaterQuality(this.me.id, this.imputsManager.dateRange).then((result) => {
        this.waterQuality = result;
      });
      me.session.devices.getQR(me.id, this.imputsManager.dateRange).then((qrCount) => {
        this.usedQRCodes = qrCount;
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
    me.session.events.getDeviceClearancesEventsLastWeekCount(me.id).then((v) => { this.clearancesAmount = v; });

    me.session.events.getDeviceClearances(me.id).then(({ results }) => {
      this.lastClearances = results.slice(0, 3);
      const datesMap = {};
      results.forEach(({ openDate }) => {
        const key = openDate.format('YYYYMMDD');
        if (!datesMap[key]) {
          datesMap[key] = [];
        }
        datesMap[key].push(openDate);
      });
      this.allClearancesDates = datesMap;
    });
  }

  @computed get lastService() {
    return this.me.maintenanceDate;
  }

  @computed get isWaterQualified() {
    return Array.isArray(this.waterQuality) && this.waterQuality.findIndex(({ quality }) => quality !== 0) >= 0;
  }

  @computed get mileage() {
    return this.me.mileage;
  }
}

export default Details;
