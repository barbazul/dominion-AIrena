import shuffle from '../shuffle';

test('Returns null without an array', () => {
  expect(shuffle('Hello')).toBeNull();
});

test('Returns array of correct length with valid array', () => {
  expect(shuffle([1, 2, 3])).toHaveLength(3);
});

test('Array elements are preserved after shuffling', () => {
  const arr = [1, 2, 3];
  const result = shuffle(arr);

  expect(result).toContain(1);
  expect(result).toContain(2);
  expect(result).toContain(3);
});

test('Actually shuffles elements', () => {
  const list = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 23, 24, 25, 26, 27, 28, 29];
  let results = [];
  let newResult;

  // Shuffle a couple of times and make sure the result is different each time
  // This is a little risky as two shuffles might correctly be identical, but the chance is really small
  for (let i = 0; i < 3; i++) {
    newResult = shuffle(list);

    expect(newResult).not.toEqual(list);

    for (let j = 0; j < results.length; j++) {
      expect(newResult).not.toEqual(results[j]);
    }

    results.push(newResult);
  }
});

test('Sorts array as expected with controlled RNG', () => {
  const list = [1, 2, 3];
  const rng = () => 0.5;
  const result = shuffle(list, rng);

  expect(result).toEqual([3, 1, 2]);
});
