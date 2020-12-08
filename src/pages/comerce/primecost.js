import React from 'react';
import { inject, Provider, observer } from 'mobx-react';

import PrimecostModel from 'models/comerce/primecost';
import PrimecostWidget from 'components/comerce/primecost';

@inject('session')
@observer
class Primecost extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({ model: new PrimecostModel(session) });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }

    return (
      <Provider table={model} filter={model.filter}>
        <PrimecostWidget />
      </Provider>
    );
  }
}

export default Primecost;
