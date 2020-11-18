import React from 'react';
import { observer, inject, Provider } from 'mobx-react';
import { Card, Button, Space } from 'antd';
import { DownloadOutlined } from '@ant-design/icons';

import SubPage from 'elements/subpage';
import Typography from 'elements/typography';
import SalesModel from 'models/comerce/sales';
import { FiltersButton } from 'elements/filters';

@inject('session')
@observer
class Sales extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({ model: new SalesModel(session) });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }
    return (
      <Provider analynic={model} filter={model.filter}>
        <SubPage
          menu={[
            {
              path: '',
              text: 'Динамика продаж',
              widget: () => <Card>xxx</Card>,
            },
            {
              path: 'alert_time',
              text: 'Структура продаж',
              widget: () => <Card>yyy</Card>,
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
