export function getObject(key: string): string | null {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : null;
}

export function setObject(key: string, value: unknown): void {
  const parsedValue = JSON.stringify(value);
  localStorage.setItem(key, parsedValue);
}
