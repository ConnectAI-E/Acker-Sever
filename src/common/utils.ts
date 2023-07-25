export function UTCDate(date: Date): string {
  const isoDate = date.toISOString();
  return `${isoDate.substring(0, 10)}`;
}

export function shuffleArray<T>(array: T[]): T[] {
  const length = array.length;
  for (let i = length - 1; i >= 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [array[i], array[randomIndex]] = [array[randomIndex], array[i]];
  }
  return array;
}
