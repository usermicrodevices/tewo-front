import React from 'react';
import { Modal, Table } from 'antd';
import { inject, observer } from 'mobx-react';
import Loader from 'elements/loader';
import NoData from 'elements/noData';

const columns = [
  {
    title: 'Показатель',
    dataIndex: 'description',
    key: 'description',
  },
  {
    title: 'Значение',
    dataIndex: 'value',
    key: 'value',
  },
  {
    title: 'Ед. измерения',
    dataIndex: 'unit',
    key: 'unit',
  },
];

const LoadingIndicator = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}><Loader size="large" /></div>
);

const BeverageIndicatorsModal = ({ session }) => {
  if (!session.beverages.beverageIndicators) {
    return null;
  }

  let content = <LoadingIndicator />;

  if (session.beverages.beverageIndicators.indicatorsList) {
    content = session.beverages.beverageIndicators.indicatorsList.length === 0 ? (
      <NoData noMargin title="Показателей по наливу не найдено!" text="попробуйтей выбрать другой налив" />
    ) : (
      <Table dataSource={session.beverages.beverageIndicators.indicatorsList} columns={columns} pagination={false} />
    );
  }

  return (
    <Modal
      title={`Показатели ${session.beverages.beverageIndicators.drinkName} (${session.beverages.beverageIndicators.id})`}
      visible={session.beverages.beverageIndicators}
      width="560px"
      bodyStyle={{
        maxHeight: '80vh',
      }}
      okText="Закрыть"
      onOk={session.beverages.unsetIndicatorBeverage}
      onCancel={session.beverages.unsetIndicatorBeverage}
      footer={null}
      destroyOnClose
    >
      {content}
    </Modal>
  );
};

export default inject('session')(observer(BeverageIndicatorsModal));
