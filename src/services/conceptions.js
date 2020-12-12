import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';

const getConceptions = (map) => get('/refs/conceptions/').then((data) => {
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

export default getConceptions;
