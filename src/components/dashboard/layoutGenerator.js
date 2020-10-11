function toKey({ x, y }) {
  return x * 1000 + y;
}

function fillRect(to, rect) {
  for (let i = 0; i < rect.w; i += 1) {
    for (let j = 0; j < rect.h; j += 1) {
      to.add(toKey({
        x: rect.x + i,
        y: rect.y + j,
      }));
    }
  }
}

function isAppropriatePosition(rect, taken) {
  for (let i = 0; i < rect.w; i += 1) {
    for (let j = 0; j < rect.h; j += 1) {
      if (taken.has(toKey({
        x: rect.x + i,
        y: rect.y + j,
      }))) {
        return false;
      }
    }
  }
  return true;
}

function findPosition(taken, size, columnsAmount) {
  const pos = { x: 0, y: 0 };
  while (!isAppropriatePosition({ ...size, ...pos }, taken)) {
    pos.x += 1;
    if (size.w + pos.x > columnsAmount) {
      pos.x = 0;
      pos.y += 1;
    }
  }
  return pos;
}

function generateLayout(storedLayout, layoutDraft, columnsAmount) {
  const takenFields = new Set();
  const result = [];
  if (Array.isArray(storedLayout) && false) {
    for (const [id, rect] of storedLayout.entries()) {
      fillRect(takenFields, rect);
      result.push(rect);
      console.assert(layoutDraft[id].i === rect.i);
    }
  }
  for (let i = result.length; i < layoutDraft.length; i += 1) {
    const pos = findPosition(takenFields, layoutDraft[i], columnsAmount);
    const solution = {
      ...layoutDraft[i],
      ...pos,
    };
    result.push(solution);
    fillRect(takenFields, solution);
  }
  return result;
}

export default generateLayout;
