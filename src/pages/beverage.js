import React from 'react';
import { inject, observer, Provider } from 'mobx-react';

import BeverageModel from 'models/beverage';
import Beverage from 'components/beverage';

@inject('session')
@observer
class SalePoints extends React.Component {
  state = {};

  static getDerivedStateFromProps(props) {
    const { session } = props;
    return { companiesModel: new BeverageModel(session) };
  }

  render() {
    const { session } = this.props;
    return (
      <Provider session={session}>
        <Beverage />
      </Provider>
    );
  }
}

export default SalePoints;
