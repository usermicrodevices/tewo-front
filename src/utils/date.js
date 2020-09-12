import moment from 'moment';

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

export {
  daterangeToArgs, momentToArg, isDateRange, stepToPast,
};
