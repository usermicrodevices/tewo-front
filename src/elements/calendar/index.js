/* eslint react/no-array-index-key: off */
import React from 'react';
import { Button, Calendar, Select } from 'antd';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import moment from 'moment';

import colors from 'themes/calendar';
import style from './calendar.module.scss';

const START_YEAR = 2010;

const CalendarWidget = ({ clearances, beverages }) => {
  const dateCellRender = (value) => {
    const key = value.format('YYYYMMDD');
    return (
      <div className={style.items}>
        { clearances && clearances[key] && <div style={{ backgroundColor: colors.clearance }}>{clearances[key]}</div> }
        { beverages && beverages[key] && <div style={{ backgroundColor: colors.beverages }}>{beverages[key]}</div> }
      </div>
    );
  };
  const headerRender = ({ onChange, value }) => (
    <div className={style.head}>
      <div className={style.month}>
        <Button type="text" icon={<LeftOutlined />} onClick={() => onChange(value.clone().subtract(1, 'month'))} />
        <div className={style.monthtext}>{value.format('MMMM')}</div>
        <Button type="text" icon={<RightOutlined />} disabled={moment() < value.clone().add(1, 'month')} onClick={() => onChange(value.clone().add(1, 'month'))} />
      </div>
      <Select defaultValue={value.year()} style={{ width: 120 }} onChange={(v) => onChange(moment(Math.min(moment(), value.clone().set('year', v))))}>
        { new Array(moment().year() - START_YEAR + 1).fill(null).map((_, id) => <Select.Option key={id} value={START_YEAR + id}>{START_YEAR + id}</Select.Option>) }
      </Select>
    </div>
  );
  return (
    <Calendar
      headerRender={headerRender}
      dateCellRender={dateCellRender}
    />
  );
};

export default CalendarWidget;
