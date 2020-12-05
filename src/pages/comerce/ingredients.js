import React from 'react';
import { inject, Provider, observer } from 'mobx-react';

import IngredientsModel from 'models/comerce/ingredients';
import Table from 'elements/table';
import Card from 'elements/card';
import { TableHeader } from 'elements/headers';

@inject('session')
@observer
class Ingredients extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({ model: new IngredientsModel(session) });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }

    return (
      <Provider table={model} filter={model.filter}>
        <TableHeader />
        <Card><Table /></Card>
      </Provider>
    );
  }
}

export default Ingredients;
