export function isPlausibleSelector(selector: string): boolean {
  const trimmed = selector.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length > 200) return false;

  // Crude "looks like CSS, not prose" check: strip bracketed/quoted content, then
  // reject anything with leftover whitespace.
  const stripped = trimmed.replace(/\[[^\]]*\]/g, '').replace(/"[^"]*"|'[^']*'/g, '');
  if (/\s/.test(stripped)) return false;

  return true;
}

export function isPlausiblePath(path: string): boolean {
  const trimmed = path.trim();
  if (trimmed.length === 0 || trimmed.length > 50) return false;
  if (!trimmed.startsWith('#/')) return false;

  const rest = trimmed.slice(2);
  if (!/^[A-Za-z0-9/-]*$/.test(rest)) return false;

  return true;
}
