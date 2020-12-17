export function getMapBoundaryOptions(locations) {
  if (!locations || locations.length === 0) {
    return { zoom: undefined, center: undefined };
  }

  const rect = [locations[0].location.slice(), locations[0].location.slice()];
  for (const { location } of locations) {
    rect[0][0] = Math.min(location[0], rect[0][0]);
    rect[1][0] = Math.max(location[0], rect[1][0]);
    rect[0][1] = Math.min(location[1], rect[0][1]);
    rect[1][1] = Math.max(location[1], rect[1][1]);
  }

  const rib = Math.max(rect[1][0] - rect[0][0], rect[1][1] - rect[0][1]);
  const center = [rect[1][0] + rect[0][0], rect[1][1] + rect[0][1]].map((v) => v / 2);
  const zoom = 12 - Math.ceil(rib / 15);

  return { zoom, center };
}

export default { getMapBoundaryOptions };
