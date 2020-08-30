import React from 'react';
import { Space } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer, Provider } from 'mobx-react';

import Card from 'elements/card';
import Icon from 'elements/icon';
import Table from 'elements/table';
import Title from 'components/title';
import { companiesSubmenu } from 'routes';

@inject('session')
@observer
class Companies extends React.Component {
  render() {
    const { session } = this.props;
    return (
      <>
        <Title tabs={companiesSubmenu}>
          <Space>
            Все компании
            <Link to="companies/add" style={{ fontSize: 22 }}><Icon name="plus-circle-outline" /></Link>
          </Space>
        </Title>
        <Card>
          <Provider table={session.companies} filter={session.companies.filter}>
            <Table />
          </Provider>
        </Card>
      </>
    );
  }
}

export default Companies;
