function plural(v, options) {
  if (typeof v !== 'number') {
    return '';
  }
  const amount = v % 100;
  if (amount >= 10 && amount < 20) {
    return options[1];
  }
  const s = amount % 10;
  if (s === 1) {
    return options[0];
  }
  if (s <= 4 && s > 1) {
    return options[2];
  }
  return options[1];
}

export default plural;
