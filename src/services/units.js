/* eslint no-param-reassign: off */
import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import { transaction } from 'mobx';

const getUnits = (acceptor) => get('/refs/units/').then((json) => {
  transaction(() => {
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
});

export default getUnits;
