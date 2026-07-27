export function isValidPin(pin: string): boolean {
  return (
    pin.length > 8 &&
    /[A-Z]/.test(pin) &&
    /[0-9]/.test(pin) &&
    /[^a-zA-Z0-9]/.test(pin)
  );
}

export function getPinRequirements(): string {
  return 'Más de 8 caracteres, al menos una mayúscula, un número y un carácter especial.';
}
