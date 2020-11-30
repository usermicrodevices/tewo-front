import { get } from 'utils/request';
import checkData from 'utils/dataCheck';
import apiCheckConsole from 'utils/console';

const getOperations = (map) => get('/refs/operations/').then((data) => {
  if (!Array.isArray(data)) {
    apiCheckConsole.error('/refs/operations/ ожидается массив, получено', data);
  }
  const result = map;
  for (const op of data) {
    if (!checkData(op, {
      id: 'number',
      value: 'string',
      description: 'string',
    })) {
      apiCheckConsole.error('не пройдена проверка данный для операции (/refs/operations/)');
    }
    const { id, value, description } = op;
    result.set(id, { value, description });
  }
  return result;
});

export { getOperations as default };
