/* eslint-disable no-bitwise, no-param-reassign, no-multi-assign */

const xmur3 = (str) => {
  let h = 1779033703 ^ str.length;
  for (let i = 0; i < str.length; i += 1) {
    h = Math.imul(h ^ str.charCodeAt(i), 3432918353);
    h = (h << 13) | (h >>> 19);
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 2246822507);
    h = Math.imul(h ^ (h >>> 13), 3266489909);
    h ^= h >>> 16;
    return h >>> 0;
  };
};

const mulberry32 = (seed) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const createRandomEngineFromStringSeed = (seed) => mulberry32(xmur3(seed)());

const randomColor = (str, opacity = 1) => {
  const randomEngine = createRandomEngineFromStringSeed(str);
  return `#${[randomEngine(), randomEngine(), randomEngine(), opacity]
    .map((colorSeed) => (`00${Math.round(colorSeed * 0xFF).toString(0x10)}`).substr(-2, 2))
    .join('')}`;
};

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

export {
  parseColor, isColor, gradient, randomColor,
};
