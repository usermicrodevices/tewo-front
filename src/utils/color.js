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

export { parseColor, isColor };
