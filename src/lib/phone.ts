const DEFAULT_COUNTRY_CODE = '504';

export function stripNonDigits(value: string): string {
  return value.replace(/\D/g, '');
}

export function formatPhone(value: string): string {
  const digits = stripNonDigits(value);
  if (digits.length === 0) return '';
  if (digits.length <= 4) return digits;
  if (digits.length <= 8) return `${digits.slice(0, 4)}-${digits.slice(4)}`;
  return `${digits.slice(0, 4)}-${digits.slice(4, 8)}-${digits.slice(8)}`;
}

export function buildWhatsAppUrl(phone: string, countryCode = DEFAULT_COUNTRY_CODE): string {
  const digits = stripNonDigits(phone);
  return digits ? `https://wa.me/${countryCode}${digits}` : '';
}

export function validatePhone(phone: string): boolean {
  return stripNonDigits(phone).length >= 8;
}
