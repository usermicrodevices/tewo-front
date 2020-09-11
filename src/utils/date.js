import moment from 'moment';

const momentToArg = (m) => m.format().replace('+', '%2B');

const daterangeToArgs = (range, name) => {
  if (!Array.isArray(range) || range.length !== 2) {
    console.error('frong daterange filter args');
    return '';
  }
  if (!moment.isMoment(range[0]) || !moment.isMoment(range[1])) {
    console.error('range range must me a moment');
    return '';
  }
  const v = range.map(momentToArg);
  return `&${name}__gte=${v[0]}&${name}__lte=${v[1]}`;
};

export { daterangeToArgs, momentToArg };
