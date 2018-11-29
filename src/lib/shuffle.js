/**
 *
 * @param {Array} arr
 * @param {function():number} rng
 * @returns {Array}
 */
import seedrandom from 'seedrandom';

export default function shuffle (arr, rng = null) {
  const resp = [];
  const keys = [];
  let size;

  if (arr && !(arr instanceof Array)) {
    return null;
  }

  if (!(rng instanceof Function)) {
    rng = seedrandom();
  }

  size = arr.length;

  for (let i = 0; i < size; i++) {
    keys.push(i);
  }

  for (let i = 0; i < size; i++) {
    const r = Math.floor(rng() * keys.length);
    const g = keys[r];

    keys.splice(r, 1);
    resp[g] = arr[i];
  }

  return resp;
}
