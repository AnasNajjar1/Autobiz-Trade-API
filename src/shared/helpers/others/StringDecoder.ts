export function decodeString(s) {
  try {
    if (s) s = decodeURIComponent(s.replace(/%E9/g, 'é').replace(/\+/g, ' '));
  } catch (e) {
    return s;
  }
  return s;
}