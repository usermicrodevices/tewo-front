/* eslint react/no-array-index-key: off */
import React from 'react';
import {
  Button, Calendar, Select, Dropdown, Menu, Popover,
} from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';

import Loader from 'elements/loader';
import colors from 'themes/calendar';
import Format from 'elements/format';

import style from './calendar.module.scss';

const START_YEAR = 2010;

const MonthSelector = ({ date, onChange }) => {
  const it = date.clone().startOf('year');
  const now = moment();
  let i = 0;
  const items = [];
  while (i < 12 && it < now) {
    const onClick = ({ key }) => { onChange(date.clone().month(parseInt(key, 10))); };
    items.push(<Menu.Item key={i} onClick={onClick}>{it.format('MMMM')}</Menu.Item>);
    i += 1;
    it.add(1, 'month');
  }
  return <Menu selectedKeys={[`${date.month()}`]}>{items}</Menu>;
};

const ClearencesCellLabel = ({ clearances }) => {
  if (Array.isArray(clearances)) {
    const formatClearanceText = (date, index) => `${index + 1}. Очистка начата в ${date.format('HH:mm')}`;
    const popoverContent = clearances
      .sort((openDate1, openDate2) => (openDate1.diff(openDate2, 'seconds') > 0 ? 1 : -1))
      .map((clearanceOpenDate, index) => <div>{formatClearanceText(clearanceOpenDate, index)}</div>);

    return (
      <Popover content={popoverContent}>
        <div style={{ backgroundColor: colors.clearance }}>
          <Format>{clearances.length}</Format>
        </div>
      </Popover>
    );
  }

  if (clearances > 0) {
    return <div style={{ backgroundColor: colors.clearance }}><Format>{clearances}</Format></div>;
  }

  return null;
};

const CalendarWidget = ({
  clearances, beverages, onPanelChange, isLoading, onSelect,
}) => {
  const dateCellRender = (value) => {
    const key = value.format('YYYYMMDD');
    return (
      <div className={style.items}>
        <ClearencesCellLabel clearances={clearances?.[key]} />
        {beverages && beverages[key] > 0 && <div style={{ backgroundColor: colors.beverages }}><Format>{beverages[key]}</Format></div>}
      </div>
    );
  };
  const headerRender = ({ onChange, value }) => {
    const now = moment();
    const isSelectMonth = value.year() === now.year() && now.month() === 0;
    const month = <div className={style.monthtext}>{value.format('MMMM')}</div>;
    return (
      <>
        <div className={style.head}>
          <div className={style.month}>
            <Button
              type="text"
              icon={<LeftOutlined />}
              onClick={() => onChange(value.clone().subtract(1, 'month'))}
            />
            {
              isSelectMonth
                ? month
                : (
                  <Dropdown
                    overlay={<MonthSelector date={value} onChange={onChange} />}
                    placement="bottomCenter"
                  >
                    {month}
                  </Dropdown>
                )
            }
            <Button
              type="text"
              icon={<RightOutlined />}
              disabled={moment() < value.clone().add(1, 'month').startOf('month')}
              onClick={() => onChange(value.clone().add(1, 'month'))}
            />
          </div>
          <Select
            defaultValue={value.year()}
            value={value.year()}
            style={{ width: 120 }}
            onChange={(v) => onChange(moment(Math.min(moment(), value.clone().set('year', v))))}
          >
            {new Array(moment().year() - START_YEAR + 1).fill(null).map((_, id) => (
              <Select.Option key={id} value={START_YEAR + id}>{START_YEAR + id}</Select.Option>
            ))}
          </Select>
        </div>
        {isLoading && <div className={style.loader}><Loader size="large" /></div>}
      </>
    );
  };
  const isAfterPanelChange = { value: false };
  const onSelectProtected = (date) => {
    if (isAfterPanelChange.value) {
      isAfterPanelChange.value = false;
    } else if (typeof onSelect === 'function') {
      onSelect(date);
    }
  };
  const onPanelChangeProtected = (date) => {
    isAfterPanelChange.value = true;
    if (typeof onPanelChange === 'function') {
      onPanelChange(date);
    }
  };
  return (
    <div className={style.wrap}>
      <Calendar
        onPanelChange={onPanelChangeProtected}
        headerRender={headerRender}
        dateCellRender={dateCellRender}
        onSelect={onSelectProtected}
      />
    </div>
  );
};

export default CalendarWidget;
