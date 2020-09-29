import moment from 'moment';

const monthMomentExporter = ((format) => {
  const jan = moment().startOf('year');
  return new Array(12).fill(null).map((_, id) => jan.clone().add(id, 'month').format(format));
});

const weekMomentExporter = ((format) => {
  const mon = moment().startOf('week');
  return new Array(7).fill(null).map((_, id) => mon.clone().add(id, 'day').format(format));
});

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

export default LOCALE;
