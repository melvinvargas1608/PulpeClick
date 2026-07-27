/**
 * Format a price in Lempiras (Honduras).
 * Returns "L 350.00" for numbers, "—" for null/undefined/NaN.
 */
export function formatPrice(price: number | null | undefined): string {
  if (price == null || isNaN(price)) return '—';
  return `L ${price.toFixed(2)}`;
}
