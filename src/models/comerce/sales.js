import Filters from 'models/filters';

class Sales {
  filters

  constructor(session) {
    this.filters = new Filters({
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
    });
  }
}

export default Sales;
