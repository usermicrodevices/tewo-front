import moment from 'moment';
import 'frozen-moment';
import plural from 'utils/plural';

const momentToArg = (m) => m.format().replace('+', '%2B');

const daterangeToArgs = (range, name) => {
  if (!Array.isArray(range) || range.length !== 2) {
    return '';
  }
  if (!moment.isMoment(range[0]) || !moment.isMoment(range[1])) {
    return '';
  }
  const v = range.map(momentToArg);
  return `&${name}__gte=${v[0]}&${name}__lte=${v[1]}`;
};

const daterangeFromArgs = (args, name) => {
  const decodedArgs = decodeURIComponent(args);
  const dateStartMatch = decodedArgs.match(new RegExp(`${name}__gte=([^&]+)`));
  const dateEndMatch = decodedArgs.match(new RegExp(`${name}__lte=([^&]+)`));

  if (!dateStartMatch || !dateEndMatch) {
    return false;
  }

  return [moment(dateStartMatch[1]), moment(dateEndMatch[1])];
};

const isDateRange = (d) => daterangeToArgs(d) !== '';

const isEndOfMonth = (date) => date.clone().endOf('month').isSame(date, 'day');
const isStartOfMonth = (date) => date.clone().startOf('month').isSame(date, 'day');
const isEndOfYear = (date) => date.clone().endOf('year').isSame(date, 'day');
const isStartOfYear = (date) => date.clone().endOf('year').isSame(date, 'day');

const stepToPast = (range) => {
  if (isEndOfYear(range[1]) && isStartOfYear(range[0])) {
    return [
      range[0].clone().subtract(1, 'years').startOf('year'),
      range[1].clone().subtract(1, 'years').endOf('year'),
    ];
  }

  if (isEndOfMonth(range[1]) && isStartOfMonth(range[0])) {
    return [
      range[0].clone().subtract(1, 'months').startOf('month'),
      range[1].clone().subtract(1, 'months').endOf('month'),
    ];
  }

  const d = range[1] - range[0];
  return [
    moment(range[0] - d),
    range[0].clone().subtract(1, 'seconds'),
  ];
};

const humanizeSeconds = (wholeSeconds) => {
  const integerSeconds = Math.round(wholeSeconds);
  const seconds = integerSeconds % 60;
  const minutes = Math.floor(integerSeconds / 60 % 60);
  const hours = Math.floor(integerSeconds / 3600 % 24);
  const days = Math.floor(integerSeconds / 3600 / 24);
  let result = `${minutes} ${plural(minutes, ['????????????', '??????????', '????????????'])}`;
  if (hours || days) {
    result = `${hours} ${plural(hours, ['??????', '??????????', '????????'])}${minutes || seconds ? ` ${result}` : ''}`;
  }
  if (days) {
    result = `${days} ${plural(days, ['????????', '????????', '??????'])}${minutes || seconds || hours ? ` ${result}` : ''}`;
  }
  if (seconds) {
    result = `${minutes || hours || days ? `${result} ` : ''}${seconds} ${plural(seconds, ['??????????????', '????????????', '??????????????'])}`;
  }
  return result;
};

const intoComparationNumber = (m, step) => Math.floor(m / 1000 / step);

function* alineDates([firstDay, lastDay], step, data, transform, dateKey = 'moment') {
  const dataMap = new Map(data.map((datum) => {
    const m = moment(datum[dateKey]);
    return [intoComparationNumber(+m, step), datum];
  }));
  const curDay = firstDay.clone();
  while (curDay <= lastDay) {
    const item = dataMap.get(intoComparationNumber(+curDay, step));
    yield {
      moment: curDay.clone(),
      ...transform(item),
    };
    curDay.add(step, 'seconds');
  }
}

const capitalize = (s) => {
  if (typeof s !== 'string') return '';
  return s.charAt(0).toUpperCase() + s.slice(1);
};
const quartalStart = () => moment().startOf('year').add(Math.floor(moment().month() / 3) * 3, 'month');
const halfAYearStart = () => moment().startOf('year').add(Math.floor(moment().month() / 6) * 6, 'month');

const SemanticRanges = {
  today: {
    title: '??????????????',
    resolver: () => [moment().startOf('day'), moment().endOf('day')],
  },
  yesterday: {
    title: '??????????',
    resolver: () => [moment().subtract(1, 'day').startOf('day'), moment().subtract(1, 'day').endOf('day')],
  },
  curWeek: {
    title: '?????????????? ????????????',
    resolver: () => [moment().startOf('week'), moment().endOf('week')],
  },
  prwWeek: {
    title: '?????????????????? ????????????',
    resolver: () => [moment().subtract(1, 'week').startOf('week'), moment().subtract(1, 'week').endOf('week')],
  },
  prw7Days: {
    title: '?????????????????? 7 ????????',
    resolver: () => [moment().subtract(6, 'day').startOf('day'), moment().endOf('day')],
  },
  prw30Days: {
    title: '?????????????????? 30 ????????',
    resolver: () => [moment().subtract(30, 'day').startOf('day'), moment().endOf('day')],
  },
  curMonth: {
    title: capitalize(moment().format('MMMM')),
    resolver: () => [moment().startOf('month'), moment().endOf('month')],
  },
  prwMonth: {
    title: capitalize(moment().subtract(1, 'month').format('MMMM')),
    resolver: () => [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')],
  },
  twoMonthAgo: {
    title: capitalize(moment().subtract(2, 'month').format('MMMM')),
    resolver: () => [moment().subtract(2, 'month').startOf('month'), moment().subtract(2, 'month').endOf('month')],
  },
  curQuartal: {
    title: '?????????????? ??????????????',
    resolver: () => [quartalStart(), quartalStart().clone().add(3, 'month').subtract(1, 'second')],
  },
  prwQuartal: {
    title: '?????????????????? ??????????????',
    resolver: () => [quartalStart().clone().subtract(3, 'month'), quartalStart().clone().subtract(1, 'second')],
  },
  curHalfAYear: {
    title: '?????????????? ??????????????????',
    resolver: () => [halfAYearStart(), halfAYearStart().clone().add(6, 'month').subtract(1, 'second')],
  },
  prwHalfAYear: {
    title: '?????????????????? ??????????????????',
    resolver: () => [halfAYearStart().clone().subtract(6, 'month'), halfAYearStart().clone().subtract(1, 'second')],
  },
  prw12Month: {
    title: '?????????????????? ???????????????????? ??????????????',
    resolver: () => [moment().subtract(11, 'month').startOf('month'), moment().endOf('month')],
  },
  curYear: {
    title: `${moment().format('YYYY')} ??????`,
    resolver: () => [moment().startOf('year'), moment().endOf('year')],
  },
  prwYear: {
    title: `${moment().subtract(1, 'year').format('YYYY')} ??????`,
    resolver: () => [moment().subtract(1, 'year').startOf('year'), moment().subtract(1, 'year').endOf('year')],
  },
};

const SmallSemanticRanges = {
  prwHour: {
    title: '?????????????????? ??????',
    resolver: () => [moment().subtract(1, 'hour'), moment()],
  },
  prwHalfAnHour: {
    title: '???????????????? 30 ??????????',
    resolver: () => [moment().subtract(30, 'minute'), moment()],
  },
};

const formatDuration = (duration) => {
  const parts = [
    duration.years(),
    duration.months(),
    duration.days(),
    duration.hours(),
    duration.minutes(),
    duration.seconds(),
  ];
  const resolvers = [
    ['??????', '??????', '????????'],
    ['??????????', '??????????????', '????????????'],
    ['????????', '????????', '??????'],
    ['??????', '??????????', '????????'],
    ['????????????', '??????????', '????????????'],
    ['??????????????', '????????????', '??????????????'],
  ];
  const result = [];
  let i = parts.findIndex((v) => v);
  if (i >= 0) {
    for (; i < parts.length; i += 1) {
      result.push(`${parts[i]} ${plural(parts[i], resolvers[i])}`);
    }
  }
  return result.join(', ') || '???????????? ??????????????';
};

export {
  daterangeToArgs, momentToArg, isDateRange, stepToPast, humanizeSeconds, alineDates, SemanticRanges, SmallSemanticRanges, formatDuration,
  daterangeFromArgs,
};
