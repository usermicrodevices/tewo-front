/* eslint class-methods-use-this: off */
import { observable, computed, action } from 'mobx';

import Table from 'models/table';
import {
  getSalePoints, applySalePoint, getSalesTop, getSalesChart, getOutdatedTasks, getSalePointLastDaysBeverages, getBeveragesSpeed,
} from 'services/salePoints';
import Filters from 'models/filters';

import { salePoints as salePointsRout } from 'routes';
import { tableItemLink } from 'elements/table/trickyCells';
import { duration } from 'moment';
import { daterangeToArgs } from 'utils/date';
import Format from 'elements/format';

import Point from './salePoint';

const COLUMNS = {
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'both',
    isAsyncorder: true,
  },
  name: {
    isDefaultSort: true,
    isVisibleByDefault: true,
    title: 'Название',
    grow: 3,
    sortDirections: 'both',
    transform: (_, datum, width) => tableItemLink(datum.name, `${salePointsRout.path}/${datum.id}`, width),
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 2,
    sortDirections: 'both',
  },
  tags: {
    isVisibleByDefault: false,
    title: 'Теги',
    grow: 2,
  },
  regionName: {
    isVisibleByDefault: false,
    title: 'Регоин',
    grow: 2,
  },
  cityName: {
    isVisibleByDefault: false,
    title: 'Город',
    grow: 2,
    sortDirections: 'both',
  },
  address: {
    isVisibleByDefault: true,
    title: 'Адрес',
    grow: 4,
    sortDirections: 'descend',
  },
  person: {
    isVisibleByDefault: false,
    title: 'Ответственный',
    grow: 2,
  },
  phone: {
    isVisibleByDefault: true,
    title: 'Телефон',
    grow: 2,
  },
  email: {
    isVisibleByDefault: true,
    title: 'Email',
    grow: 2,
  },
  downtime: {
    isVisibleByDefault: true,
    title: 'Суммарный простой',
    transform: (v, width) => {
      if (typeof v !== 'number') {
        return Format({ children: v, width });
      }
      if (v === 0) {
        return 'Без простоя';
      }
      return duration(v, 'seconds').humanize();
    },
    grow: 2,
  },
};

const declareFilters = (session) => ({
  companyId: {
    type: 'singleselector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  tag: {
    type: 'selector',
    title: 'Тег',
    apply: (general, data) => general(data.drink),
    selector: () => [
    ],
    disabled: true,
  },
  regionId: {
    type: 'singleselector',
    title: 'Регион',
    apply: (general, data) => general(data.regionId),
    selector: () => session.locations.regionsSelector,
  },
  cityId: {
    type: 'singleselector',
    title: 'Город',
    apply: (general, data) => general(data.cityId),
    selector: () => session.locations.citiesSelector,
  },
  isHaveOverdueTasks: {
    type: 'checkbox',
    title: 'С просроченными событиями',
    apply: (_, data) => data.isHaveOverdueTasks,
    passiveValue: false,
  },
  isNeedTechService: {
    type: 'checkbox',
    title: 'Требуется тех. обслуживание',
    apply: (_, data) => data.isNeedTechService,
    passiveValue: false,
  },
  isHaveDisabledEquipment: {
    type: 'checkbox',
    title: 'С выключенным оборудованием',
    apply: (_, data) => data.isHaveDisabledEquipment,
    passiveValue: false,
  },
  isHasOverlocPPM: {
    type: 'checkbox',
    title: 'На оборудовании превышена жесткость воды',
    apply: (_, data) => data.isHasOverlocPPM,
    passiveValue: false,
  },
});

class SalePoints extends Table {
  actions = {
    isVisible: true,
    isEditable: () => true,
    onEdit: (datum, push) => {
      push(`sale_points/${datum.id}/edit`);
    },
  };

  chart = null;

  @observable elementForEdit;

  get isImpossibleToBeAsync() { return true; }

  session;

  constructor(session) {
    const filters = new Filters(declareFilters(session));
    super(COLUMNS, getSalePoints(session), filters);
    this.session = session;
  }

  toString() {
    return 'SalePoints';
  }

  get(pointId) {
    return this.rawData.find(({ id }) => id === pointId);
  }

  getSubset(set) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.filter(({ id }) => set.has(id));
  }

  getByCompanyIdSet(companyIdSet) {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.filter(({ companyId }) => companyIdSet.has(companyId));
  }

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  @action create() {
    const itm = new Point(this.session);
    this.elementForEdit = itm;
    itm.onCreated = () => {
      this.rawData.push(itm);
    };
  }

  getSalesTop(points, daterange) {
    let filter = '';
    if (Array.isArray(points)) {
      if (points.length !== 0) {
        if (points.length === 1) {
          filter = `device__sale_point__id=${points[0]}`;
        } else {
          filter = `device__sale_point__id__in=${points}`;
        }
      }
    } else if (points !== null) {
      filter = `device__sale_point__id=${points}`;
    }
    const rangeArg = daterangeToArgs(daterange, 'device_date');
    if (filter.length === 0 && rangeArg.length !== 0) {
      filter = rangeArg.slice(1);
    } else {
      filter = `${filter}${rangeArg}`;
    }
    return getSalesTop(filter);
  }

  getSalesChart = getSalesChart;

  getOutdatedTasks = getOutdatedTasks;

  getSalePointLastDaysBeverages = getSalePointLastDaysBeverages;

  applyer = applySalePoint;

  getBeveragesSpeed(salePointsId) {
    const ids = (Array.isArray(salePointsId) ? salePointsId : this.rawData.map(({ id }) => id));
    return getBeveragesSpeed(ids);
  }

  getPathForPoint(id) {
    return `${salePointsRout.path}/${id}`;
  }
}

export default SalePoints;
