/* eslint valid-typeof: "off" */

function checkData(data, shouldBe, mayBe, tests) {
  const keysSet = Object.keys(data).reduce((set, datum) => ({ [datum]: datum, ...set }), {});
  for (const [key, type] of Object.entries(shouldBe)) {
    if (!(key in data)) {
      console.error(`Не обнаружено обязательное поле ${key}`, data, shouldBe);
      return false;
    }
    if (!typecheck(data[key], key, type)) {
      return false;
    }
    delete keysSet[key];
  }
  if (typeof mayBe !== 'undefined') {
    for (const [key, type] of Object.entries(mayBe)) {
      if (key in data) {
        if (data[key] !== null && !typecheck(data[key], key, type)) {
          return false;
        }
        delete keysSet[key];
      }
    }
  }
  const unexpectedKeys = Object.keys(keysSet);
  if (unexpectedKeys.length > 0) {
    if (unexpectedKeys.length > 1) {
      console.error(`Обнаружены неизвестные поля: [${unexpectedKeys.join(', ')}]`);
      return false;
    }
    console.error(`Обнаружено неизвестное поле: ${unexpectedKeys[0]}`, data);
    return false;
  }
  if (typeof tests !== 'undefined') {
    for (const [key, func] of Object.entries(tests)) {
      if (key in data) {
        if (!func(data[key])) {
          console.error(`Не пройдена проверка данных для поля ${key}`, data);
          return false;
        }
      } else if (!(key in mayBe)) {
        console.error(`Обнаружена неконсистентность проверочных данных для поля ${key}`, data, shouldBe, mayBe, tests);
        return false;
      }
    }
  }
  return true;
}

function typecheck(datum, key, type) {
  if (type === 'any') {
    return true;
  }
  if (type === 'date') {
    if (typeof datum !== 'string') {
      console.error(`Для поля ${key} ожидается тип date, представленный в виде строки, получен ${typeof datum}`, datum);
      return false;
    }
    if (isNaN(Date.parse(datum))) {
      console.error(`Для поля ${key} ожидается тип date, переданная строка не являющаяся датой`, datum);
      return false;
    }
    return true;
  }
  if (type === 'array') {
    if (Array.isArray(datum)) {
      return true;
    }
    console.error(`Для поля ${key} ожидается тип array, полученные данные не являются массивом`, datum);
    return false;
  }
  if (type === 'location') {
    if (typeof datum === 'string') {
      const location = datum.split(',').map(parseFloat);
      if (location.length === 2 && location.filter(isFinite).length === 2) {
        return true;
      }
      console.error(`Для поля ${key} ожидается тип location, полученные данные содержат не два числа (${location.length})`, datum);
      return false;
    }
    console.error(`Для поля ${key} ожидается тип location, полученные данные не являются строкой`, datum);
    return false;
  }
  if (typeof datum !== type) {
    console.error(`Для поля ${key} ожидается тип ${type}, обнаружен ${typeof datum}`);
    return false;
  }
  return true;
}

export default checkData;
