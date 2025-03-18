/**
 * Clamps a number between a minimum and maximum value
 * @param {number} number The number to clamp
 * @param {number} a First boundary
 * @param {number} b Second boundary
 * @returns {number} The clamped value
 */
export function clamp(number: number, a: number, b: number): number {
  let min = Math.min(a, b);
  let max = Math.max(a, b);
  return Math.min(Math.max(number, min), max);
} 