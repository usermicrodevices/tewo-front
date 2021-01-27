/* eslint class-methods-use-this: off */
import { observable, when } from 'mobx';

import Filters from 'models/filters';
import Table from 'models/table';
import { getEventsClearancesChart, getDetergrnts } from 'services/events';
import { daterangeToArgs, SemanticRanges } from 'utils/date';
import { getLastCleanings } from 'services/device';

const declareFilters = (session) => ({
  companyId: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  salePointId: {
    type: 'selector',
    title: 'Объект',
    apply: (general, data) => general(data.salePointId),
    selector: () => session.points.selector,
  },
  deviceModelName: {
    type: 'selector',
    title: 'Модель оборудования',
    apply: (general, data) => general(data.deviceModelId),
    selector: () => session.deviceModels.selector,
  },
  isOn: {
    type: 'checkbox',
    title: 'Только включенное оборудование',
    apply: (_, data) => data.isOn !== false,
    passiveValue: false,
  },
  clearanceDate: {
    type: 'daterange',
    title: 'Дата очистки',
    apply: () => true,
  },
});

class Cleans extends Table {
  @observable cleans;

  @observable stats = {};

  @observable lastCleans = new Map();

  constructor(session) {
    const filters = new Filters(declareFilters(session));

    filters.set('clearanceDate', SemanticRanges.prw30Days.resolver());

    filters.isShowSearch = false;

    const columns = {
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
      salePointName: {
        isVisibleByDefault: true,
        title: 'Объект',
        grow: 1,
      },
      name: {
        isVisibleByDefault: true,
        title: 'Оборудование',
        grow: 1,
      },
      lastClean: {
        isVisibleByDefault: true,
        transform: (_, { id }) => {
          if (this.lastCleans.size === 0) {
            return undefined;
          }
          return this.lastCleans.get(id) || null;
        },
        title: 'Посл. очистка',
        grow: 1,
        sortDirections: 'both',
        isDefaultSort: true,
        isAsyncorder: true,
      },
    };

    super(columns, () => (
      when(() => session.devices.isLoaded).then(() => {
        this.cleans = undefined;
        this.stats = {};
        const { rawData: devices } = session.devices;
        const results = devices.filter(filters.predicate);
        const devicesFilter = results.length === devices.length ? [] : results.map(({ id }) => id);
        const daterange = filters.get('clearanceDate');
        getEventsClearancesChart(devicesFilter, daterange)
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

        const deviceFilter = devicesFilter.length > 0 ? `device__id${devicesFilter.length > 1 ? '__in' : ''}=${devicesFilter}` : '';
        const dateFilter = daterangeToArgs(daterange, 'open_date');
        getDetergrnts(deviceFilter ? `${deviceFilter}${dateFilter}` : dateFilter.slice(1))
          .then((stats) => { this.stats = stats; });
        return {
          count: results.length,
          results,
        };
      })
    ), filters);

    getLastCleanings().then((result) => { this.lastCleans = result; });
  }

  toString() {
    return 'ComerceCleans';
  }

  get isImpossibleToBeSync() { return true; }
}

export default Cleans;
