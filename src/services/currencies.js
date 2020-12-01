import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';

const getCurrencies = (map) => get('/refs/currencies/').then((data) => {
  if (Array.isArray(data)) {
    for (const json of data) {
      if (checkData(json, {
        id: 'number',
        name: 'string',
        alias: 'string',
      })) {
        map.set(json.id, { name: json.name, alias: json.alias });
      } else {
        apiCheckConsole.error('неожиданный ответ от словаря валют', json);
      }
    }
  } else {
    apiCheckConsole.error('Словарь валют - не массив', data);
  }
});

export default getCurrencies;
