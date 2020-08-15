import React from 'react';
import { inject } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-dom';

import BeverageComponent from 'components/beverage';

@withRouter
@inject('session')
class Beverage extends React.Component {
  constructor(props) {
    super(props);

    const { session, location } = props;
    session.beverages.updateFilters(location.search.slice(1));
    session.beverages.startContinuousValidation();
  }

  componentWillUnmount() {
    const { session } = this.props;
    session.beverages.stopContinuousValidation();
  }

  render() {
    const { session } = this.state;
    const { filters } = session.beverages;
    const { location } = this.props;
    const isNeedToRedirect = location.search.slice(1) !== filters.search;
    return (
      <>
        { isNeedToRedirect && <Redirect to={`${location.pathname}?${filters.search}`} /> }
        <BeverageComponent />
      </>
    );
  }
}

export default Beverage;
