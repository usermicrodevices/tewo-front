import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Table from 'elements/table';
import Editor from 'elements/editor';
import Card from 'elements/card';

import { TableHeader } from 'elements/headers';

@withRouter
@inject('table')
@observer
class GenericTablePage extends React.Component {
  updateTimeout = null;

  isUnmounted = false;

  constructor(props) {
    super(props);

    const { table, location } = props;
    table.filter.search = location.search.slice(1);
  }

  componentDidMount() {
    const { table, refreshInterval } = this.props;
    if (refreshInterval) {
      const update = () => {
        table.validate().then(() => {
          if (!this.isUnmounted) {
            this.updateTimeout = setTimeout(update, refreshInterval);
          }
        });
      };
      update();
    }
  }

  componentWillUnmount() {
    this.isUnmounted = true;
  }

  onCancelEdditing = () => {
    const { table } = this.props;
    table.elementForEdit = null;
  }

  render() {
    const { table, title } = this.props;
    const { elementForEdit } = table;
    return (
      <>
        <TableHeader title={title} />
        { elementForEdit && <Editor data={elementForEdit} isModal onCancel={this.onCancelEdditing} /> }
        <Card>
          <Table />
        </Card>
      </>
    );
  }
}

export default GenericTablePage;
