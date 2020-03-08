export function formatPercentageText(value: number) {
  value = value * 100;
  return `${Math.round(value)}%`;
}

export function binomdist(events: number, success: number, probability: number) {
  const a = events;
  const b = success;
  const c = probability;

  if (c > 1 || b > a) {
    return 0;
  }

  let z = 1;
  for (let i = a; i >= 1; i--) {
    z = z * i;
  }

  let x = 1;
  for (let k = b; k >= 1; k--) {
    x = x * k;
  }

  const s = a - b;
  let t = 1;
  for (let j = s; j >= 1; j--) {
    t = t * j;
  }

  // Binomial Distribution
  return ((z / t) / x) * Math.pow(c, b) * Math.pow(1 - c, a - b);
}

export function add(x: number, y: number) {
  return x + y;
}

export function subtract(x: number, y: number) {
  return x - y;
}
