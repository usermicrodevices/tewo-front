import React from 'react';
import { Provider } from 'mobx-react';
import { withRouter, Redirect } from 'react-router-dom';

import Filters from 'models/table/filters';
import BeverageComponent from 'components/beverage';
import { reaction } from 'mobx';

@withRouter
class Beverage extends React.Component {
  state;

  constructor(props) {
    super(props);
    const { location } = props;
    this.state = {
      filters: new Filters(location.search.slice(1)),
    };
    const { filters } = this.state;

    reaction(() => filters.search, () => { this.forceUpdate(); });
  }

  render() {
    const { filters } = this.state;
    const { location } = this.props;
    const isNeedToRedirect = location.search.slice(1) !== filters.search;
    return (
      <>
        { isNeedToRedirect && <Redirect to={`${location.pathname}?${filters.search}`} /> }
        <Provider filters={filters}>
          <BeverageComponent />
        </Provider>
      </>
    );
  }
}

export default Beverage;
