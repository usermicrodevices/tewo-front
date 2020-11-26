import React from 'react';
import {
  Typography, Button, Dropdown, Menu,
} from 'antd';
import { Link } from 'react-router-dom';
import moment from 'moment';

import { devices as devicesRout } from 'routes';
import Format from 'elements/format';
import plural from 'utils/plural';
import ChangesLabel from 'elements/changesLabel';

const { Text } = Typography;

const linkedCell = (onClick) => (name, datum, width) => (
  <Button className="cell-link" style={{ height: 20 }} onClick={onClick(datum)} type="link"><Format width={width}>{ name }</Format></Button>
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
            <Menu>
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
    </span>
  );
};

const durationCell = ({ openDate, closeDate }) => {
  if (openDate.isValid()) {
    return (
      <>
        <div><Text>{openDate.format('d MMMM, hh:mm')}</Text></div>
        <div><Text type="secondary">{closeDate.isValid() ? moment.duration(closeDate - openDate).humanize() : 'не завершено'}</Text></div>
      </>
    );
  }
  return <Format>{null}</Format>;
};

const rangeMetricCompareCell = ({ cur, prw }) => {
  if (typeof cur !== 'number') {
    return <Format>{ cur }</Format>;
  }
  const render = (a, b, c) => (
    <Text>
      <div style={{ display: 'flex', alignItems: 'baseline' }}>
        <Format>{ a }</Format>
        {' / '}
        <Format>{ b }</Format>
        { ' / '}
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
    <ChangesLabel typographySize="m" value={(cur - prw) / prw * 100} />,
  );
};

const explainedTitleCell = (title, explains) => (
  <>
    <Text>{ title }</Text>
    {' '}
    <Text type="secondary">{ explains }</Text>
  </>
);

export {
  tableItemLink, linkedCell, devicesCell, durationCell, rangeMetricCompareCell, explainedTitleCell,
};
