import React from 'react';
import { observer, inject, Provider } from 'mobx-react';
import { Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import SubPage from 'elements/subpage';
import Typography from 'elements/typography';
import SalesModel from 'models/comerce/sales';
import { FiltersButton } from 'elements/filters';
import SalesDistribution from 'components/comerce/salesDistribution';
import SalesDynamic from 'components/comerce/salesDynamic';
import SalesStructModel from 'models/comerce/salesStruct';

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
    return (
      <Provider table={model} filter={model.filter}>
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
          title={(
            <>
              <Typography.Title level={1}>
                Аналитика продаж
              </Typography.Title>
              <Space>
                <Button disabled icon={<DownloadOutlined />}>Экспорт Excel</Button>
                <FiltersButton />
              </Space>
            </>
          )}
        />
      </Provider>
    );
  }
}

export default Sales;
