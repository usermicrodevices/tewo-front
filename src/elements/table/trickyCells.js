import React from 'react';
import { Button, Dropdown, Space } from 'antd';
import { Link } from 'react-router-dom';

import { devices as devicesRout } from 'routes';
import Format from 'elements/format';
import plural from 'utils/plural';

const linkedCell = (onClick) => (name, datum, width) => (
  <Button className="cell-link" onClick={onClick(datum)} type="link"><Format width={width}>{ name }</Format></Button>
);

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
    <span>
      {devices.slice(0, forShow).map((device, id) => (
        <>
          {
            tableItemLink(device.name, `${devicesRout.path}/${device.id}`, isNeedDropdown ? APROPRIATE_ELEM_WIDTH : width / forShow)
          }
          {id < devices.length - 1 ? ', ' : ''}
        </>
      ))}
      { isNeedDropdown && (
        <Dropdown
          overlay={(
            <Space>
              {
                devices.slice(forShow).map(({ name, id }) => tableItemLink(name, `${devicesRout.path}/${id}`, width))
              }
            </Space>
          )}
          placement="bottomRight"
        >
          <span>{`${forShow > 0 ? 'и ещё ' : ''}${devices.length - forShow} ${plural(devices.length - forShow, ['устройство', 'устройств', 'устройства'])}`}</span>
        </Dropdown>
      )}
    </span>
  );
};

export { tableItemLink, linkedCell, devicesCell };
