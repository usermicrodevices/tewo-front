import React from 'react';
import { Provider } from 'mobx-react';

import Table from 'elements/table';
import SimpleTableModel from 'models/table/simple';

class SimpleTable extends React.Component {
  model;

  constructor(props) {
    super(props);

    const { columns, dataSource } = this.props;
    this.model = new SimpleTableModel(dataSource, columns);
  }

  render() {
    const {
      columns, dataSource, className, minWidth,
    } = this.props;
    this.model.rows = dataSource;
    this.model.columns = columns;
    return (
      <Provider table={this.model}>
        <Table minWidth={minWidth} className={className} />
      </Provider>
    );
  }
}

export default SimpleTable;
