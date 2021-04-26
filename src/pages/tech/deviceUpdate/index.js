import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { inject, Provider, observer } from 'mobx-react';

import DeviceUpdate from './deviceUpdate';
import Session from './session';

import DeviceUpdateModel from 'models/packages';

@inject('session')
@observer
class Page extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({
      model: new DeviceUpdateModel(session),
    });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }

    return (
      <Provider manager={model}>
        <Switch>
          <Route path="/session/:id">
            <Session />
          </Route>
          <Route>
            <DeviceUpdate />
          </Route>
        </Switch>
      </Provider>
    );
  }
}

export default Page;
