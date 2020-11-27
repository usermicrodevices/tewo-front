import { computed, observable } from 'mobx';

class Details {
  session;

  @observable data;

  @computed get isLoaded() {
    return typeof this.data !== 'undefined';
  }

  constructor(salesRow) {
    this.session = salesRow.session;

    salesRow.filter.salesDetails(salesRow.salePointId).then((result) => {
      console.log(result);
    });
  }
}

export default Details;
