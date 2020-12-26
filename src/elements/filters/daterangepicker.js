import React from 'react';
import { DatePicker } from 'antd';
import moment from 'moment';

import Typography from 'elements/typography';
import { isDateRange } from 'utils/date';

import style from './style.module.scss';

const { RangePicker } = DatePicker;

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};

const DatergangePicker = ({
  title, value, onChange, showTime,
}) => {
  const quartalStart = moment().startOf('year').add(Math.floor(moment().month() / 3) * 3, 'month');
  const halfAYearStart = moment().startOf('year').add(Math.floor(moment().month() / 6) * 6, 'month');
  const realOnChange = (v) => {
    if (isDateRange(v) && !showTime) {
      return onChange([v[0].startOf('day'), v[1].endOf('day')]);
    }
    return onChange(v);
  };
  return (
    <div className={style.space}>
      <Typography.Text>{ `${title}:` }</Typography.Text>
      <RangePicker
        showTime={showTime}
        placeholder={['с', 'по']}
        ranges={{
          Сегодня: [moment().startOf('day'), moment().endOf('day')],
          Вчера: [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
          'Текущая неделя': [moment().startOf('week'), moment().endOf('week')],
          'Прошедшая неделя': [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
          'Прошедшие 7 дней': [moment().subtract(7, 'day').startOf('day'), moment()],
          'Прошедшие 30 дней': [moment().subtract(30, 'day').startOf('day'), moment()],
          [capitalize(moment().format('MMMM'))]: [moment().startOf('month'), moment().endOf('month')],
          [capitalize(moment().subtract(1, 'month').format('MMMM'))]: [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
          [capitalize(moment().subtract(2, 'month').format('MMMM'))]: [moment().subtract(2, 'month').startOf('month'), moment().subtract(2, 'month').endOf('month')],
          'Текущий квартал': [quartalStart, quartalStart.clone().add(3, 'month').subtract(1, 'second')],
          'Прошедший квартал': [quartalStart.clone().subtract(3, 'month'), quartalStart.clone().subtract(1, 'second')],
          'Текущее полугодие': [halfAYearStart, halfAYearStart.clone().add(6, 'month').subtract(1, 'second')],
          'Прошедшее полугодие': [halfAYearStart.clone().subtract(6, 'month'), halfAYearStart.clone().subtract(1, 'second')],
          'Прошедшие двенадцать месяцев': [moment().subtract(12, 'month'), moment()],
          [`${moment().format('YYYY')} год`]: [moment().startOf('year'), moment().endOf('year')],
          [`${moment().subtract(1, 'year').format('YYYY')} год`]: [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
        }}
        onChange={realOnChange}
        value={value}
      />
    </div>
  );
};

export default DatergangePicker;
