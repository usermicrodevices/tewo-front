function isColor(text) {
  return /^#[A-Fa-f0-9]{6}$/.test(text);
}

function parseColor(color) {
  if (!isColor(color)) {
    return null;
  }
  return [
    color.slice(1, 3),
    color.slice(3, 5),
    color.slice(5, 7),
  ].map((v) => parseInt(v, 16));
}

const gradient = (begin, end) => {
  const a = parseColor(begin);
  const b = parseColor(end);
  return (part) => `#${
    a.map((min, id) => Math.round(min + (b[id] - min) * Math.pow(part, 0.8)).toString(0x10)).join('')
  }`;
};

export { parseColor, isColor, gradient };
