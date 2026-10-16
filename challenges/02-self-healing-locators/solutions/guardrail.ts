export function isPlausibleSelector(selector: string, brokenSelector: string): boolean {
  const trimmed = selector.trim();
  if (trimmed.length === 0) return false;
  if (trimmed.length > 200) return false;
  if (trimmed === brokenSelector) return false;

  // Crude "looks like CSS, not prose" check: strip bracketed/quoted content, then
  // reject anything with leftover whitespace.
  const stripped = trimmed.replace(/\[[^\]]*\]/g, '').replace(/"[^"]*"|'[^']*'/g, '');
  if (/\s/.test(stripped)) return false;

  return true;
}
