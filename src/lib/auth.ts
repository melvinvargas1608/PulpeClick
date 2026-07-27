const SESSION_SECRET = import.meta.env.ADMIN_PIN || 'Admin123!';

/**
 * Simple hash function using DJB2 — fast, deterministic, no native deps.
 * Combined with the ADMIN_PIN as secret for session validation.
 */
function hash(input: string): string {
  let h = 5381;
  for (let i = 0; i < input.length; i++) {
    h = ((h << 5) + h + input.charCodeAt(i)) | 0;
  }
  return h.toString(36);
}

/**
 * Create a session token: randomId.hash(randomId + secret)
 */
export function createSessionToken(): string {
  const random = Math.random().toString(36).substring(2) + Date.now().toString(36);
  const sig = hash(random + SESSION_SECRET);
  return `${random}.${sig}`;
}

/**
 * Verify a session token.
 */
export function verifySessionToken(signed: string | undefined): boolean {
  if (!signed) return false;

  const dotIndex = signed.indexOf('.');
  if (dotIndex === -1) return false;

  const token = signed.slice(0, dotIndex);
  const signature = signed.slice(dotIndex + 1);

  if (!token || !signature) return false;

  return hash(token + SESSION_SECRET) === signature;
}
