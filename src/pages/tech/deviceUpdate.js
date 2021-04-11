import React from 'react';
import { inject, Provider, observer } from 'mobx-react';
import { Space, Button } from 'antd';
import { withRouter, Route } from 'react-router-dom';

import Icon from 'elements/icon';
import SubPage from 'elements/subpage';
import Typography from 'elements/typography';
import { FiltersButton } from 'elements/filters';
import DeviceUpdateModel from 'models/packages';
import Table from 'elements/table';
import Card from 'elements/card';
import CreatePackageWizard from 'components/сreatePackageWizard';
import Packages from 'components/packages';

@withRouter
@inject('session')
@observer
class DeviceUpdate extends React.Component {
  state = { model: null };

  componentDidMount() {
    const { session } = this.props;
    this.setState({
      model: new DeviceUpdateModel(session),
    });
  }

  render() {
    const { model } = this.state;
    if (model === null) {
      return null;
    }
    const { location, match } = this.props;
    const isSessions = location.pathname.indexOf('sessions') >= 0;

    const title = (
      <>
        <Space>
          <Typography.Title level={1}>
            Загрузки пакета обновления оборудования
          </Typography.Title>
          <Button onClick={() => { model.chreatePackage(); }} icon={<Icon size={22} name="plus-circle-outline" />} type="text" />
        </Space>
        <Space>
          { !isSessions && <div key="devices"><Provider filter={model.devices.filter}><FiltersButton /></Provider></div> }
          { isSessions && <div key="packages"><Provider filter={model.sessions.filter}><FiltersButton /></Provider></div> }
        </Space>
        <Provider filter={model.devices.filter} packagesHolder={model}><CreatePackageWizard /></Provider>
      </>
    );
    return (
      <SubPage
        menu={[
          {
            path: '',
            text: 'Оборудование',
            widget: () => (
              <Provider table={model.devices} filter={model.devices.filter}>
                <Card><Table /></Card>
              </Provider>
            ),
          },
          {
            path: 'sessions',
            text: 'Сессии загрузки',
            widget: () => (
              <Provider table={model.sessions} filter={model.sessions.filter}>
                <Card><Table /></Card>
              </Provider>
            ),
          },
        ]}
        routTransformer={(routs) => [
          routs[0],
          (
            <Route key="id" path={`${match.path}/:id`}>
              <Card>
                <Packages />
              </Card>
            </Route>
          ),
          routs[1],
        ]}
        title={title}
      />
    );
  }
}

export default DeviceUpdate;
