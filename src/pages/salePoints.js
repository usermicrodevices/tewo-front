import React from 'react';
import { inject, observer, Provider } from 'mobx-react';

import SalePointsModel from 'models/salePoints';
import SaleModelComponent from 'components/salePoints';

@inject('session')
@observer
class SalePoints extends React.Component {
  state = {};

  static getDerivedStateFromProps(props) {
    const { session } = props;
    return { salePointsModel: new SalePointsModel(session) };
  }

  render() {
    const { salePointsModel } = this.state;
    return (
      <Provider salePoints={salePointsModel}>
        <SaleModelComponent />
      </Provider>
    );
  }
}

export default SalePoints;
