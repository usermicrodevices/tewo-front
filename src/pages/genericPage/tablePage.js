import React from 'react';
import { withRouter } from 'react-router-dom';
import { inject, observer } from 'mobx-react';

import Table from 'elements/table';
import Editor from 'elements/editor';
import Card from 'elements/card';

import { TableHeader } from './headers';

@withRouter
@inject('storage')
@observer
class GenericTablePage extends React.Component {
  updateTimeout = null;

  constructor(props) {
    super(props);

    const { storage, location } = props;
    storage.filter.search = location.search.slice(1);
  }

  componentDidMount() {
    const { storage, refreshInterval } = this.props;
    if (refreshInterval) {
      const update = () => {
        storage.validate().then(() => {
          this.updateTimeout = setTimeout(update, refreshInterval);
        });
      };
      update();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.updateTimeout);
  }

  onCancelEdditing = () => {
    const { storage } = this.props;
    storage.elementForEdit = null;
  }

  render() {
    const { storage, title } = this.props;
    const { elementForEdit } = storage;
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
