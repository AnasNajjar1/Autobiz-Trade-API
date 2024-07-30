export function combinations(string) {
  const result = [];

  const loop = function (start, depth, prefix) {
    let next;
    for (let i = start; i < string.length; i++) {
      if (prefix) {
        next = `${prefix} ${string[i]}`;
      } else {
        next = `${string[i]}`;
      }

      if (depth > 0) loop(i + 1, depth - 1, next);
      else result.push(next);
    }
  };

  for (let i = 0; i < string.length; i++) {
    loop(0, i, '');
  }

  return result;
}
