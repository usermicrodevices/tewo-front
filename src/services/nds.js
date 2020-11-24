/* eslint no-param-reassign: off */
import { get } from 'utils/request';
import checkData from 'utils/dataCheck';

const getNDS = (acceptor) => get('/refs/ndses/').then((json) => {
  if (!Array.isArray(json)) {
    return;
  }
  for (const elem of json) {
    checkData(elem, {
      id: 'number',
      name: 'string',
      alias: 'string',
      value: 'number',
    });
    acceptor.set(elem.id, elem.name);
  }
});

export default getNDS;
