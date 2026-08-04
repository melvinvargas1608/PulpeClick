/**
 * Format a price with a currency symbol.
 * Example: formatPrice(350, 'L') → "L 350.00"
 * Returns "—" for null/undefined/NaN.
 */
export function formatPrice(price: number | null | undefined, currency = 'L'): string {
  if (price == null || isNaN(price)) return '—';
  return `${currency} ${price.toFixed(2)}`;
}
