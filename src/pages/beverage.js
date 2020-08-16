import React from 'react';
import { inject, observer } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-dom';

import BeverageComponent from 'components/beverage';

@withRouter
@inject('session')
@observer
class Beverage extends React.Component {
  updateTimeout = null;

  constructor(props) {
    super(props);

    const { session, location } = props;
    session.beverages.filter.search = location.search.slice(1);
  }

  componentDidMount() {
    const { session } = this.props;
    const update = () => {
      session.beverages.validate().then(() => {
        this.updateTimeout = setTimeout(update, 3000);
      });
    };
    update();
  }

  componentWillUnmount() {
    clearTimeout(this.updateTimeout);
  }

  render() {
    const { location, session } = this.props;
    const { filter } = session.beverages;
    const isNeedToRedirect = location.search.slice(1) !== filter.search;
    return (
      <>
        { isNeedToRedirect && <Redirect to={`${location.pathname}?${filter.search}`} /> }
        <BeverageComponent />
      </>
    );
  }
}

export default Beverage;
