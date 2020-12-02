import React from 'react';
import { inject, Provider, observer } from 'mobx-react';

import CencelModel from 'models/comerce/cancelations';
import CencelWidget from 'components/comerce/cancelations';

@inject('session')
@observer
class Cleans extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({ model: new CencelModel(session) });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }

    return (
      <Provider table={model} filter={model.filter}>
        <CencelWidget />
      </Provider>
    );
  }
}

export default Cleans;
