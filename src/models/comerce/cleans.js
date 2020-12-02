/* eslint class-methods-use-this: off */
import { observable, when } from 'mobx';

import Filters from 'models/filters';
import Table from 'models/table';
import { getEventsClearancesChart, getDetergrnts } from 'services/events';
import { DECLARE_DEVICE_FILTERS } from 'models/devices';

const declareColumns = () => ({
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 1,
  },
  cityName: {
    isVisibleByDefault: true,
    title: 'Город',
    grow: 1,
  },
  tag: {
    isVisibleByDefault: true,
    title: 'Тег',
    grow: 1,
  },
  salePointName: {
    isVisibleByDefault: true,
    title: 'Объект',
    grow: 1,
  },
  deviceName: {
    isVisibleByDefault: true,
    title: 'Оборудование',
    grow: 1,
  },
  clearanceDate: {
    isVisibleByDefault: true,
    title: 'Посл. очистка',
    grow: 1,
    sortDirections: 'both',
    isDefaultSort: true,
    isAsyncorder: true,
  },
});

class Sales extends Table {
  @observable cleans;

  @observable stats = {};

  constructor(session) {
    const filters = new Filters(DECLARE_DEVICE_FILTERS(session));

    filters.isShowSearch = false;

    super(declareColumns(session), () => (
      when(() => session.devices.isLoaded).then(() => {
        this.cleans = undefined;
        this.stats = {};
        const { rawData: devices } = session.devices;
        const results = devices.filter(filters.predicate);
        const devicesFilter = results.length === devices.length ? [] : results.map(({ id }) => id);
        getEventsClearancesChart(devicesFilter)
          .then((result) => {
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
            this.cleans = series;
          });

        getDetergrnts(devicesFilter.length > 0 ? `device__id${devicesFilter.length > 1 ? '__in' : ''}=${devicesFilter}` : '')
          .then((stats) => { this.stats = stats; });
        return {
          count: results.length,
          results,
        };
      })
    ), filters);
  }

  toString() {
    return 'ComerceCleans';
  }

  get isImpossibleToBeSync() { return true; }
}

export default Sales;
