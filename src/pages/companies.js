import React from 'react';
import { inject, observer, Provider } from 'mobx-react';

import CompaniesComponent from 'components/companies';
import CompaniesModel from 'models/companies';

@inject('session')
@observer
class Companies extends React.Component {
  state = {};

  static getDerivedStateFromProps(props) {
    const { session } = props;
    return { companiesModel: new CompaniesModel(session) };
  }

  render() {
    const { companiesModel } = this.state;
    return (
      <>
        <Provider companies={companiesModel}>
          <CompaniesComponent />
        </Provider>
      </>
    );
  }
}

export default Companies;
