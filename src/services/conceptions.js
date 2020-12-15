import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';

const getConceptions = (map) => {
  const pluExt = get('/refs/plu_exts/').then((ppp) => {
    if (!Array.isArray(ppp)) {
      apiCheckConsole.error('Неожиданный ответ по адресу plu_exts', ppp);
      return {};
    }
    const result = {};
    for (const json of ppp) {
      if (checkData(json, {
        id: 'number',
        plu: 'number',
        drink: 'number',
        conception: 'number',
      })) {
        const { plu, drink, conception } = json;
        if (!(conception in result)) {
          result[conception] = {};
        }
        const part = result[conception];
        part[drink] = plu;
      }
    }
    return result;
  });
  const conceptions = get('/refs/conceptions/').then((data) => {
    if (Array.isArray(data)) {
      for (const json of data) {
        if (checkData(json, {
          id: 'number',
          name: 'string',
          company: 'number',
        })) {
          map.set(json.id, { name: json.name, companyId: json.company });
        } else {
          apiCheckConsole.error('неожиданный ответ от словаря концепций', json);
        }
      }
    } else {
      apiCheckConsole.error('Словарь концепций - не массив', data);
    }
  });
  Promise.all([pluExt, conceptions]).then(([extPLU]) => {
    for (const [conceptionId, conception] of map.entries()) {
      conception.extPLU = extPLU[conceptionId];
    }
  });
};

export default getConceptions;
