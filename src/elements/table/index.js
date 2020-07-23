import React from 'react';
import { inject, observer } from 'mobx';

@inject('table')
@observer
class Table extends React.Component {
  state = { filter: '' };



  render() {
    const { table: { data, columns } } = this.props;
    const { filter } = this.state;
    return (
      <Table columns={columns} dataSource={data} />
    );
  }
}
