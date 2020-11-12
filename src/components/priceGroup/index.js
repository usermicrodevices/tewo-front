import React, { useState } from 'react';
import { inject, observer } from 'mobx-react';
import { Button, Modal } from 'antd';
import { LoadingOutlined, CheckCircleOutlined, ReloadOutlined } from '@ant-design/icons';

import PriceList from './priceList';
import PricePicker from './pricePicker';
import DeviceList from './devicesList';
import DevicePicker from './devicesPicker';

import style from './style.module.scss';

const PriceGroupTitleAction = inject('element')(observer(
  ({ element }) => {
    const [isSynchronizing, setSynchronizing] = useState(false);
    const onClick = () => {
      setSynchronizing(true);
      element.synchronize().then(() => setSynchronizing(false));
    };
    const { isSynchronized } = element;
    const notLoadingIcon = isSynchronized ? <CheckCircleOutlined /> : <ReloadOutlined />;
    const notLoadingMessage = isSynchronized ? 'Синхронизовано' : 'Синхронизировать';
    return (
      <Button
        disabled={isSynchronizing || isSynchronized}
        icon={isSynchronizing ? <LoadingOutlined /> : notLoadingIcon}
        onClick={onClick}
      >
        { isSynchronizing ? 'Синхронизация...' : notLoadingMessage}
      </Button>
    );
  },
));

@inject('element')
@observer
class PriceGroupOverview extends React.Component {
  state = { openedPicker: null, sendingData: null };

  selectedPrices = new Set();

  selectedDevices = new Set();

  setOpenedPicker = (openedPicker) => {
    this.setState({ openedPicker });
  };

  onCancel = () => this.setState({ openedPicker: null, sendingData: null });

  render() {
    const { element } = this.props;
    const { openedPicker, sendingData } = this.state;

    const MODALS = {
      device: {
        title: 'Оборудование',
        commit: () => element.addDevices([...this.selectedDevices.values()]),
      },
      price: {
        title: 'Напитки',
        commit: () => element.addPrices([...this.selectedPrices.values()]),
      },
    };

    const onOk = () => {
      this.setState({ sendingData: openedPicker, openedPicker: null });
      MODALS[openedPicker].commit().then(this.onCancel);
    };

    const MyModal = ({ children, mode }) => (
      <Modal
        title={MODALS[mode]?.title}
        visible={openedPicker === mode}
        okText="Добавить"
        cancelText="Закрыть"
        onCancel={this.onCancel}
        onOk={onOk}
        width={600}
      >
        { children }
      </Modal>
    );

    const onSelectPrice = (data) => {
      console.log(data);
      this.selectedPrices = data;
    };

    const onSelectDevice = (data) => {
      this.selectedDevices = data;
    };

    return (
      <div className={style.root}>
        <MyModal mode="device">
          <DevicePicker onSelect={onSelectDevice} />
        </MyModal>
        <MyModal mode="price">
          <PricePicker onSelect={onSelectPrice} />
        </MyModal>
        <DeviceList isLoading={sendingData === 'device'} onAdd={() => this.setOpenedPicker('device')} />
        <PriceList isLoading={sendingData === 'price'} onAdd={() => this.setOpenedPicker('price')} />
      </div>
    );
  }
}

export { PriceGroupOverview, PriceGroupTitleAction };
