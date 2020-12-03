export default function Greating({ hours }) {
  const morningStartAt = 5;
  const afternoonStartAt = 12;
  const eveningStartAt = 19;

  if (hours > morningStartAt && hours < afternoonStartAt) {
    return 'Доброе утро!';
  } if (hours < eveningStartAt) {
    return 'Добрый день!';
  }

  return 'Добрый вечер!';
}
