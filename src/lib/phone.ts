const DEFAULT_COUNTRY_CODE = '504'; // Honduras — solo usado si no se detecta prefijo internacional

export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

/**
 * Format a phone number for display.
 * International (+503 1234-5678) or local (1234-5678).
 */
export function formatPhone(value: string): string {
  const trimmed = value.trim();

  // International format with +
  if (trimmed.startsWith('+')) {
    const digits = stripNonDigits(trimmed);
    if (digits.length === 0) return '';
    // Detect country code (1-3 digits) and format rest as local
    const codeLen = digits.length >= 11 ? 2 : digits.length >= 10 ? 2 : 3;
    const code = digits.slice(0, codeLen);
    const local = digits.slice(codeLen);
    if (local.length === 0) return `+${code}`;
    if (local.length <= 4) return `+${code} ${local}`;
    if (local.length <= 8) return `+${code} ${local.slice(0, 4)}-${local.slice(4)}`;
    return `+${code} ${local.slice(0, 4)}-${local.slice(4, 8)}-${local.slice(8)}`;
  }

  // Local format (backward compatible)
  const digits = stripNonDigits(value);
  if (digits.length === 0) return '';
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
}

/**
 * Build a WhatsApp URL from a phone number.
 * If the number starts with "+", uses the full international digits.
 * Otherwise, prepends the default Honduras country code (504) for backward compatibility.
 */
export function buildWhatsAppUrl(phone: string): string {
  const trimmed = phone.trim();

  // International: +50312345678 → wa.me/50312345678
  if (trimmed.startsWith('+')) {
    const digits = stripNonDigits(trimmed);
    return digits ? `https://wa.me/${digits}` : '';
  }

  // Local: 1234-5678 → wa.me/50412345678 (backward compatible)
  const digits = stripNonDigits(phone);
  return digits ? `https://wa.me/${DEFAULT_COUNTRY_CODE}${digits}` : '';
}

/**
 * Validate a phone number.
 * International: at least 10 digits (country code + local number).
 * Local: at least 8 digits.
 */
export function validatePhone(phone: string): boolean {
  const trimmed = phone.trim();
  if (trimmed.startsWith('+')) {
    return stripNonDigits(trimmed).length >= 10;
  }
  return stripNonDigits(phone).length >= 8;
}
