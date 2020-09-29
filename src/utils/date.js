import moment from 'moment';
import plural from 'utils/plural';

const momentToArg = (m) => m.format().replace('+', '%2B');

const daterangeToArgs = (range, name) => {
  if (!Array.isArray(range) || range.length !== 2) {
    console.error('wrong daterange filter args');
    return '';
  }
  if (!moment.isMoment(range[0]) || !moment.isMoment(range[1])) {
    return '';
  }
  const v = range.map(momentToArg);
  return `&${name}__gte=${v[0]}&${name}__lte=${v[1]}`;
};

const isDateRange = (d) => daterangeToArgs(d) !== '';

const stepToPast = (range) => {
  const d = range[1] - range[0];
  return [
    moment(range[0] - d),
    range[0],
  ];
};

const humanizeSeconds = (wholeSeconds) => {
  const integerSeconds = Math.round(wholeSeconds);
  const seconds = integerSeconds % 60;
  const minutes = Math.floor(integerSeconds / 60 % 60);
  const hours = Math.floor(integerSeconds / 3600 % 24);
  const days = Math.floor(integerSeconds / 3600 / 24);
  let result = `${minutes} ${plural(minutes, ['минута', 'минут', 'минуты'])}`;
  if (hours || days) {
    result = `${hours} ${plural(hours, ['час', 'часов', 'часа'])}${minutes || seconds ? ` ${result}` : ''}`;
  }
  if (days) {
    result = `${days} ${plural(days, ['день', 'дней', 'дня'])}${minutes || seconds || hours ? ` ${result}` : ''}`;
  }
  if (seconds) {
    result = `${minutes || hours || days ? `${result} ` : ''}${seconds} ${plural(seconds, ['секунда', 'секунд', 'секунды'])}`;
  }
  return result;
};

const intoComparationNumber = (m) => m.hour() + m.dayOfYear() * 1e2 + m.year() * 1e5;

function* alineDates([firstDay, lastDay], isHoursMode, data, transform) {
  const timeKey = isHoursMode ? 'hour' : 'day';
  const dataMap = new Map(data.map((datum) => {
    const m = moment(datum[timeKey]);
    return [intoComparationNumber(m), datum];
  }));
  const curDay = firstDay.clone();
  const timePart = isHoursMode ? 'hours' : 'days';
  while (curDay <= lastDay) {
    const item = dataMap.get(intoComparationNumber(curDay));
    yield {
      [timeKey]: curDay.clone(),
      ...transform(item),
    };
    curDay.add(1, timePart);
  }
}

export {
  daterangeToArgs, momentToArg, isDateRange, stepToPast, humanizeSeconds, alineDates,
};
