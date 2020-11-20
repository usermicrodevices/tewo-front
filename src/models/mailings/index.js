/* eslint class-methods-use-this: off */
import { observable, computed } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';

import { tableItemLink } from 'elements/table/trickyCells';
import { mailings as mailingsRout, salePoints as salePointsRout } from 'routes';

import { getMailings, patchMailing } from 'services/mailings';

const COLUMNS = ({
  id: {
    isVisibleByDefault: true,
    title: 'ID',
    width: 70,
    sortDirections: 'both',
    isAsyncorder: true,
  },
  name: {
    isVisibleByDefault: true,
    title: 'Название',
    grow: 4,
    sortDirections: 'both',
    isDefaultSort: true,
    transform: (_, datum, width) => tableItemLink(datum.name, `${mailingsRout.path}/${datum.id}`, width),
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 4,
    sortDirections: 'both',
    isDefaultSort: true,
  },
});

const declareFilters = (session) => ({
  companyId: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
});

class Mailings extends Table {
  get isImpossibleToBeAsync() { return true; }

  toString() {
    return 'Mailings';
  }

  constructor(session) {
    super(COLUMNS, getMailings(session), new Filters(declareFilters(session)));
  }

  @computed get selector() {
    if (!this.isLoaded) {
      return undefined;
    }
    return this.rawData.map(({ id, name }) => [id, name]);
  }

  get(mailingId) {
    return this.rawData.find(({ id }) => mailingId === id);
  }
}

export default Mailings;
