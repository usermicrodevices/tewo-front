import React from 'react';
import { inject, Provider, observer } from 'mobx-react';

import CleansModel from 'models/comerce/cleans';
import CleansWidget from 'components/comerce/cleans';

@inject('session')
@observer
class Cleans extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({ model: new CleansModel(session) });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }

    return (
      <Provider table={model} filter={model.filter}>
        <CleansWidget />
      </Provider>
    );
  }
}

export default Cleans;
