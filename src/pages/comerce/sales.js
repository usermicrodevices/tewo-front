import React from 'react';
import { withRouter } from 'react-router-dom';
import { observer, inject, Provider } from 'mobx-react';
import { Space } from 'antd';

import SubPage from 'elements/subpage';
import Typography from 'elements/typography';
import SalesModel from 'models/comerce/sales';
import { FiltersButton } from 'elements/filters';
import SalesDistribution from 'components/comerce/salesDistribution';
import SalesDynamic from 'components/comerce/salesDynamic';
import SalesStructModel from 'models/comerce/salesStruct';

@withRouter
@inject('session')
@observer
class Sales extends React.Component {
  state = { model: null, distributionModel: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({ model: new SalesModel(session), distributionModel: new SalesStructModel(session) });
  }

  render() {
    const { model, distributionModel } = this.state;
    if (model === null) {
      return null;
    }
    const { location } = this.props;
    const isDistribution = location.pathname.indexOf('distribution') >= 0;

    const title = (
      <>
        <Typography.Title level={1}>
          Аналитика продаж
        </Typography.Title>
        <Space>
          { !isDistribution && <div key="sales"><Provider filter={model.filter}><FiltersButton /></Provider></div> }
          { isDistribution && <div key="distribution"><Provider filter={distributionModel.filter}><FiltersButton /></Provider></div> }
        </Space>
      </>
    );
    return (
      <SubPage
        menu={[
          {
            path: '',
            text: 'Динамика продаж',
            widget: () => (
              <Provider table={model} filter={model.filter}>
                <SalesDynamic />
              </Provider>
            ),
          },
          {
            path: 'distribution',
            text: 'Структура продаж',
            widget: () => (
              <Provider table={distributionModel} filter={distributionModel.filter}>
                <SalesDistribution />
              </Provider>
            ),
          },
        ]}
        title={title}
      />
    );
  }
}

export default Sales;
