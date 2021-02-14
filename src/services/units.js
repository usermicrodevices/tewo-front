/* eslint no-param-reassign: off */
import { get } from 'utils/request';
import checkData from 'utils/dataCheck';

const getUnits = (acceptor) => get('/refs/units/').then((json) => {
  if (!Array.isArray(json)) {
    return;
  }
  for (const elem of json) {
    checkData(elem, {
      id: 'number',
      name: 'string',
      label: 'string',
    });
    acceptor.set(elem.id, { name: elem.name, label: elem.label });
  }
});

export default getUnits;
