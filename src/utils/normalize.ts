
export function normalizeCoords(coords: Coords[]) {
  return coords.map((c) => [c[1], c[0]]);
}
