export type PasswordStrength = {
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
};

export const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function isValidEmail(value: string) {
  return emailPattern.test(value.trim());
}

export function scorePassword(password: string): PasswordStrength {
  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/\d/.test(password) && /[^A-Za-z0-9]/.test(password)) score++;

  const labels = ["Too weak", "Weak", "Fair", "Good", "Strong"] as const;
  const clamped = Math.min(score, 4) as PasswordStrength["score"];
  return { score: clamped, label: labels[clamped] };
}
