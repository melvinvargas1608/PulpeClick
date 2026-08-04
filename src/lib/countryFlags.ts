/**
 * Mapa de países a emojis de bandera.
 * Si un país no está listado, no se muestra bandera (solo texto).
 */
const FLAG_MAP: Record<string, string> = {
  Honduras: '🇭🇳',
  Guatemala: '🇬🇹',
  'El Salvador': '🇸🇻',
  'Costa Rica': '🇨🇷',
  Nicaragua: '🇳🇮',
  Panamá: '🇵🇦',
  México: '🇲🇽',
  Colombia: '🇨🇴',
};

/**
 * Lista de países para el dropdown del formulario.
 * Orden: Centroamérica, México, Colombia, Otro.
 */
export const COUNTRY_OPTIONS = [
  'Honduras',
  'Guatemala',
  'El Salvador',
  'Costa Rica',
  'Nicaragua',
  'Panamá',
  'México',
  'Colombia',
  'Otro',
] as const;

export type Country = (typeof COUNTRY_OPTIONS)[number];

/**
 * Devuelve el emoji de bandera para un país, o cadena vacía si no está mapeado.
 */
export function getCountryFlag(country: string): string {
  return FLAG_MAP[country] ?? '';
}

/**
 * Formatea país con bandera: "🇭🇳 Honduras" o solo "Honduras" si no hay bandera.
 */
export function formatCountryWithFlag(country: string): string {
  const flag = getCountryFlag(country);
  return flag ? `${flag} ${country}` : country;
}
