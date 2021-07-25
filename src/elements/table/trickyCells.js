import React, { useState, useRef } from 'react';
import {
  Typography, Button, Dropdown, Menu, Popover,
  Popconfirm,
  Input,
} from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { devices as devicesRout } from 'routes';
import Format from 'elements/format';
import plural from 'utils/plural';
import ChangesLabel from 'elements/changesLabel';
import classNames from './trickyCells.module.scss';

const { Text } = Typography;

const linkedCell = (onClick) => (name, datum, width) => (
  <Button className="cell-link" style={{ height: 20 }} onClick={onClick(datum)} type="link"><Format width={width}>{ name }</Format></Button>
);

const popoverCell = (content, popover, width) => <Popover content={popover}><Format width={width}>{ content }</Format></Popover>;

const tableItemLink = (text, to, width) => <Link to={to}><Format width={width}>{text}</Format></Link>;

const devicesCell = (devices, _, width) => {
  if (!Array.isArray(devices)) {
    return <Format>{devices}</Format>;
  }
  if (devices.length === 0) {
    return <Format>{null}</Format>;
  }
  const APROPRIATE_ELEM_WIDTH = 200;
  const MENU_TITLE_WIDDTH = 150;
  let forShow = Math.max(1, Math.floor((width - MENU_TITLE_WIDDTH) / APROPRIATE_ELEM_WIDTH));
  if (forShow + 1 === devices.length) {
    forShow = devices.length;
  }
  const isNeedDropdown = forShow < devices.length;
  return (
    <div className={classNames.devices}>
      {devices.slice(0, forShow).map((device, id) => (
        <React.Fragment key={device.id}>
          {
            tableItemLink(device.name, `${devicesRout.path}/${device.id}`, isNeedDropdown ? APROPRIATE_ELEM_WIDTH : width / forShow)
          }
          {id < devices.length - 1 && !isNeedDropdown ? ', ' : ''}
        </React.Fragment>
      ))}
      { isNeedDropdown && (
        <Dropdown
          overlay={(
            <Menu style={{ maxHeight: 300, overflowY: 'auto' }}>
              {
                devices.slice(forShow).map(({ name, id }) => (
                  <Menu.Item key={id}>
                    { tableItemLink(name, `${devicesRout.path}/${id}`, width) }
                  </Menu.Item>
                ))
              }
            </Menu>
          )}
          placement="bottomRight"
        >
          <span>
            {`${forShow > 0 ? ' и ещё ' : ''}${devices.length - forShow} ${plural(devices.length - forShow, ['устройство', 'устройств', 'устройства'])}`}
          </span>
        </Dropdown>
      )}
    </div>
  );
};

const durationCell = ({ openDate, closeDate }) => {
  if (openDate.isValid()) {
    return (
      <Text>
        {closeDate.isValid() ? moment.duration(closeDate - openDate).humanize() : 'не завершено'}
      </Text>
    );
  }
  return <Format>{null}</Format>;
};

const rangeMetricCompareCell = ({ cur, prw }, suffix = '') => {
  if (typeof cur !== 'number') {
    return <Format>{ cur }</Format>;
  }
  const render = (a, b, c) => (
    <Text>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <Format>{ a }</Format>
        {`${suffix} / `}
        <Format>{ b }</Format>
        {`${suffix} / `}
        <Format>{ c }</Format>
      </div>
    </Text>
  );
  if (typeof prw !== 'number') {
    return render(cur, null, null);
  }
  if (prw === 0) {
    return render(cur, 0, null);
  }
  return render(
    cur,
    prw,
    cur === prw ? 0 : <ChangesLabel typographySize="m" value={(cur - prw) / prw * 100} />,
  );
};

const explainedTitleCell = (title, explains) => (
  <>
    <Text>{ title }</Text>
    {' '}
    <Text type="secondary">{ explains }</Text>
  </>
);

const sophisticatedPopconfirm = (rowData, actions) => () => {
  const { drinksAmount, name } = rowData;
  const requiredRow = 'Удалить';
  const [inputRow, setInputRow] = useState('');
  const onConfirm = () => { actions.onDelete(rowData); };
  const inputRef = useRef(null);
  const form = () => (
    <div style={{ maxWidth: 380 }}>
      {`Вы собираетесь удалить ингредиент ${name}${drinksAmount ? `, который используется в ${drinksAmount} \
      ${plural(drinksAmount, ['напитке', 'напитках', 'напитке'])}? ` : '? '}`}
      <span style={{ color: 'rgb(245, 110, 100)' }}>После удаления восстановление невозможно</span>
      <div style={{ paddingTop: 8, color: '#9a9a9a' }}>
        { `Для продолжения введите "${requiredRow}" в поле ввода и нажмите “Да” для удаления ингредиента`}
      </div>
      <div style={{ paddingTop: 8 }}>
        <Input onPressEnter={onConfirm} ref={inputRef} value={inputRow} onChange={({ target }) => setInputRow(target.value)} />
      </div>
    </div>
  );
  return (
    <Popconfirm
      placement="left"
      title={form}
      onConfirm={onConfirm}
      okText="Да"
      cancelText="Нет"
      okButtonProps={{ disabled: requiredRow.toLowerCase() !== inputRow.toLowerCase() }}
    >
      <Button
        onClick={() => setTimeout(() => { if (inputRef.current) { inputRef.current.focus(); } }, 10)}
        type="link"
        icon={<DeleteOutlined style={{ transform: 'scale(1.37)' }} />}
      />
    </Popconfirm>
  );
};

export {
  tableItemLink, linkedCell, devicesCell, durationCell, rangeMetricCompareCell, explainedTitleCell, sophisticatedPopconfirm, popoverCell,
};
