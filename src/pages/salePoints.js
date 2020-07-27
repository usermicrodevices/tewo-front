import React from 'react';
import { inject, observer, Provider } from 'mobx-react';

import SalePointsModel from 'models/salePoints';
import SaleModelComponent from 'components/saleModel';

@inject('session')
@observer
class SalePoints extends React.Component {
  state = {};

  static getDerivedStateFromProps(props) {
    const { session } = props;
    return { companiesModel: new SalePointsModel(session) };
  }

  render() {
    const { session } = this.props;
    return (
      <Provider session={session}>
        <SaleModelComponent />
      </Provider>
    );
  }
}

export default SalePoints;
