import { get } from 'utils/request';
import checkData from 'utils/dataCheck';

const getOperations = (map) => get('/refs/operations/').then((data) => {
  if (!Array.isArray(data)) {
    console.error('/refs/operations/ ожидается массив, получено', data);
  }
  const result = map;
  for (const op of data) {
    if (!checkData(op, {
      id: 'number',
      value: 'string',
      description: 'string',
    })) {
      console.error('не пройдена проверка данный для операции (/refs/operations/)');
    }
    const { id, value, description } = op;
    result.set(id, { value, description });
  }
  return result;
});

export { getOperations as default };
