import React from 'react';
import { Card, Space } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer, Provider } from 'mobx-react';

import CompaniesModel from 'models/companies';
import Icon from 'elements/icon';
import Title from 'components/title';

const companiesSubmenu = [
  {
    path: '/companies',
    text: 'Каталог',
  },
];

const routes = [
  {
    path: '/',
    breadcrumbName: 'Главная',
  },
  {
    path: '/companies',
    breadcrumbName: 'Справочник',
  },
];

@inject('session')
@observer
class Companies extends React.Component {
  static getDerivedStateFromProps(props) {
    const { session } = props;
    return { companiesModel: new CompaniesModel(session) };
  }

  render() {
    const { companiesModel } = this.state;
    return (
      <>
        <Title tabs={companiesSubmenu} breadcrumb={{ routes }}>
          <Space>
            Заголовок
            <Link to="companies/add" style={{ fontSize: 22 }}><Icon name="plus-circle-outline" /></Link>
          </Space>
        </Title>
        <Card>
          <Provider companies={companiesModel}>
            Табличка
          </Provider>
        </Card>
      </>
    );
  }
}

export default Companies;
