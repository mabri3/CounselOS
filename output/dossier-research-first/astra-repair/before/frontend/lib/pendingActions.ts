export function beginPendingAction(current: string[], key: string): string[] {
  return current.includes(key) ? current : [...current, key];
}

export function endPendingAction(current: string[], key: string): string[] {
  return current.filter((item) => item !== key);
}
