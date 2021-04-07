import moment from 'moment';
import plural from 'utils/plural';

const monthMomentExporter = ((format) => {
  const jan = moment().startOf('year');
  return new Array(12).fill(null).map((_, id) => jan.clone().add(id, 'month').format(format));
});

const weekMomentExporter = ((format) => {
  const mon = moment().startOf('week');
  return new Array(7).fill(null).map((_, id) => mon.clone().add(id, 'day').format(format));
});

function relativeTimeWithPlural(number, withoutSuffix, key) {
  const format = {
    ss: withoutSuffix
      ? ['секунда', 'секунды', 'секунд']
      : ['секунду', 'секунды', 'секунд'],
    mm: withoutSuffix
      ? ['минута', 'минуты', 'минут']
      : ['минуту', 'минуты', 'минут'],
    hh: ['час', 'часа', 'часов'],
    dd: ['день', 'дня', 'дней'],
    ww: ['неделя', 'недели', 'недель'],
    MM: ['месяц', 'месяца', 'месяцев'],
    yy: ['год', 'года', 'лет'],
  };

  const localKey = key.length === 1 ? `${key}${key}` : key;

  return `${number} ${plural(+number, format[localKey])}`;
}

const LOCALE = {
  defaultLocale: 'ru',
  locales: [{
    name: 'ru',
    options: {
      months: monthMomentExporter('MMMM'),
      shortMonths: monthMomentExporter('MMM'),
      days: weekMomentExporter('dd'),
      shortDays: weekMomentExporter('dddd'),
      toolbar: {
        selectionZoom: 'Увеличение',
        zoomIn: 'Приблизить',
        zoomOut: 'Отдалить',
        pan: 'Перетянуть',
        reset: 'Сбросить увеличение',
      },
    },
  }],
};

moment.updateLocale('ru', {
  relativeTime: {
    future: 'через %s',
    past: '%s назад',
    s: 'несколько секунд',
    ss: relativeTimeWithPlural,
    m: relativeTimeWithPlural,
    mm: relativeTimeWithPlural,
    h: relativeTimeWithPlural,
    hh: relativeTimeWithPlural,
    d: relativeTimeWithPlural,
    dd: relativeTimeWithPlural,
    w: relativeTimeWithPlural,
    ww: relativeTimeWithPlural,
    M: relativeTimeWithPlural,
    MM: relativeTimeWithPlural,
    y: relativeTimeWithPlural,
    yy: relativeTimeWithPlural,
  },
});

export default LOCALE;
