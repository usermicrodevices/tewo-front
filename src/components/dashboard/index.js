import React from 'react';
import { Provider, inject } from 'mobx-react';
import {
  Button, Dropdown, Space,
} from 'antd';

import Icon from 'elements/icon';
import Typography from 'elements/typography';

import Grid from './grid';
import SettingsEditor from './settingsEditor';
import DateSelector from './dateSelector';

import style from './index.module.scss';

@inject('session')
class Dashboard extends React.Component {
  storage;

  interval = null;

  state = { isMenuOpen: false };

  constructor(props) {
    super(props);

    this.storage = props.session.dashboard;
  }

  componentDidMount() {
    this.interval = setInterval(() => {
      this.storage.tick();
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  setMenuOpen = (isMenuOpen) => {
    this.setState({ isMenuOpen });
  };

  render() {
    const { storage, setMenuOpen } = this;
    const { isMenuOpen } = this.state;
    return (
      <Provider grid={storage}>
        <SettingsEditor />
        <div className={style.wrapper}>
          <div className={style.header}>
            <Typography.Title level={1}>Панель управления</Typography.Title>
            <Space>
              <Dropdown
                onVisibleChange={setMenuOpen}
                visible={isMenuOpen}
                overlay={<DateSelector onClick={({ key }) => { setMenuOpen(false); storage.setDateRangeGlobal(key); }} />}
                placement="bottomRight"
                trigger={['click']}
              >
                <Button className={style.button} icon={<Icon name="calendar-outline" />}>Диапазон дат</Button>
              </Dropdown>
              <Button className={style.button} onClick={() => { storage.editNewSettings(); }}>+ добавить</Button>
            </Space>
          </div>
          <Grid />
        </div>
      </Provider>
    );
  }
}

export default Dashboard;
