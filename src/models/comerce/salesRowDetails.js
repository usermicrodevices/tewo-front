import { computed, observable } from 'mobx';

class Details {
  session;

  @observable data;

  @computed get isLoaded() {
    return typeof this.data !== 'undefined';
  }

  constructor(salesRow) {
    this.session = salesRow.session;
    console.log('create details');
  }
}

export default Details;
