/* eslint class-methods-use-this: off */
import { observable, action, computed } from 'mobx';

import Table from 'models/table';
import Filters from 'models/filters';
import Mailing from 'models/mailings/mailing';

import { tableItemLink } from 'elements/table/trickyCells';
import { mailings as mailingsRout } from 'routes';

import { getMailings, applyMailing, deleteMailing } from 'services/mailings';

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
  emails: {
    isVisibleByDefault: true,
    title: 'Адреса',
    grow: 4,
    sortDirections: 'both',
    transform: (emails) => emails.join(', '),
  },
  companyName: {
    isVisibleByDefault: true,
    title: 'Компания',
    grow: 4,
    sortDirections: 'both',
  },
});

const declareFilters = (session) => ({
  companyId: {
    type: 'selector',
    title: 'Компания',
    apply: (general, data) => general(data.companyId),
    selector: () => session.companies.selector,
  },
  email: {
    type: 'text',
    title: 'Email',
    apply: (general, data) => general(data.emails.join(', ')),
  },
});

class Mailings extends Table {
  get isImpossibleToBeAsync() { return true; }

  @observable elementForEdit;

  actions = {
    isVisible: true,
    isEditable: () => true,
    onEdit: (datum) => {
      this.elementForEdit = datum;
    },
    onDelete: (datum) => {
      deleteMailing(datum.id).then(this.rawData.splice(this.rawData.findIndex((d) => d === datum), 1));
    },
  };

  toString() {
    return 'Mailings';
  }

  constructor(session) {
    super(COLUMNS, getMailings(session), new Filters(declareFilters(session)));

    this.session = session;
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

  @action create() {
    const itm = new Mailing(this.session);
    this.elementForEdit = itm;
    itm.onCreated = () => {
      this.rawData.push(itm);
    };
  }

  update = applyMailing;
}

export default Mailings;
