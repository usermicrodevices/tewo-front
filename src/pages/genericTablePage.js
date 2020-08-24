import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-dom';

import Editor from 'elements/editor';
import Card from 'elements/card';
import Loader from 'elements/loader';

@withRouter
@inject('session')
@observer
class GenericTablePage extends React.Component {
  updateTimeout = null;

  constructor(props) {
    super(props);

    const { session, location, storageName } = props;
    session[storageName].filter.search = location.search.slice(1);
  }

  componentDidMount() {
    const { session, refreshInterval, storageName } = this.props;
    if (refreshInterval) {
      const update = () => {
        session[storageName].validate().then(() => {
          this.updateTimeout = setTimeout(update, refreshInterval);
        });
      };
      update();
    }
  }

  componentWillUnmount() {
    clearTimeout(this.updateTimeout);
  }

  render() {
    const {
      location,
      session,
      children,
      match: { params: { id }, path },
      storageName,
      isNotEditable,
    } = this.props;
    const { filter, rawData } = session[storageName];
    if (typeof id !== 'undefined' && !isNotEditable) {
      const idNum = parseInt(id, 10);
      const elementForEdit = rawData.find(({ id: itmId }) => idNum === itmId);
      if (elementForEdit) {
        return <Card><Editor data={elementForEdit} /></Card>;
      }
      return <Card><Loader size="huge" /></Card>;
    }
    if (rawData.length === 1 && !isNotEditable) {
      const [company] = rawData;
      return <Redirect to={`${path}/${company.id}`} />;
    }
    const isNeedToRedirect = location.search.slice(1) !== filter.search;
    return (
      <>
        { isNeedToRedirect && <Redirect to={`${location.pathname}?${filter.search}`} /> }
        { children }
      </>
    );
  }
}

export default GenericTablePage;
