export function passwordValidator(password: string): boolean {
  if (!password) {
    return false;
  }

  return (
    hasMinumumLength(password, 6) &&
    containsNumber(password) &&
    containsUppercase(password) &&
    containsLowercase(password) &&
    containsUnderscore(password)
  );
}

function containsNumber(password: string): boolean {
  return /[0-9]/.test(password);
}

function hasMinumumLength(password: string, minLength = 6): boolean {
  return password.length >= minLength;
}

function containsUppercase(password: string): boolean {
  return /[A-Z]/.test(password);
}

function containsLowercase(password: string): boolean {
  return /[a-z]/.test(password);
}

function containsUnderscore(password: string): boolean {
  return password.includes('_');
}
