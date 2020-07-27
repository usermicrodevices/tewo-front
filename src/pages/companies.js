import React from 'react';
import { Card, Space } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer, Provider } from 'mobx-react';

import CompaniesModel from 'models/companies';
import Icon from 'elements/icon';
import Table from 'elements/table';
import Title from 'components/title';

import style from './companies.module.scss';

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
  state = {};

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
        <Card className={style.card}>
          <Provider table={companiesModel}>
            <Table />
          </Provider>
        </Card>
      </>
    );
  }
}

export default Companies;
